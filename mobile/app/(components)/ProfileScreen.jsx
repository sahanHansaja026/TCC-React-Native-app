import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import authService from '../services/authService';

export default function ProfileScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndOrders = async () => {
            try {
                const user = await authService.getUserData(); // ⬅️ Make sure this returns user object
                if (user && user.email) {
                    setUser(user.email);
                    const response = await axios.get(
                        `http://10.0.2.2:9000/get/email?email=${user.email}`
                    );
                    if (response.data.success) {
                        setOrders(response.data.existingPosts);
                    }
                }
            } catch (error) {
                console.error('Error fetching orders or user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndOrders();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No orders found for {user}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => (
                <View
                    style={{
                        marginBottom: 15,
                        padding: 15,
                        backgroundColor: '#f9f9f9',
                        borderRadius: 10,
                    }}
                >
                    <Text style={{ fontWeight: 'bold' }}>Order ID: {item._id}</Text>
                    <Text>Email: {item.email}</Text>
                    {item.image && (
                        <Image
                            source={{ uri: item.image }}
                            style={{ height: 100, width: '100%', marginTop: 10, borderRadius: 10 }}
                            resizeMode="cover"
                        />
                    )}
                </View>
            )}
        />
    );
}
