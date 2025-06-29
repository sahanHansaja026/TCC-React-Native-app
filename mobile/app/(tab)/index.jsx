import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://10.0.2.2:9000/get/orders');
                const data = await response.json();
                if (data.success) {
                    setProducts(data.existingPosts);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
                <KeyboardAvoidingView>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.heading}>Latest Products</Text>
                        <View style={styles.productList}>
                            {products.map((product) => (
                                <TouchableOpacity
                                    key={product._id}
                                    style={styles.card}
                                    onPress={() => router.push('', { product })}
                                >
                                    {product.image && (
                                        <Image source={{ uri: product.image }} style={styles.image} />
                                    )}
                                    <Text style={styles.name}>{product.product}</Text>
                                    <Text style={styles.price}>LKR {" "}{product.price}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    productList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: {
        width: Dimensions.get('window').width / 2 - 24,
        marginBottom: 16,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    image: { width: '100%', height: 100, borderRadius: 6 },
    name: { marginTop: 8, fontWeight: '500' },
    price: { color: '#f60', marginTop: 4 },
});
