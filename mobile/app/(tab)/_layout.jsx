import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Menu, Provider } from 'react-native-paper';
import { View, Pressable, Image,StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import authService from "../services/authService";

export default function TabLayout() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [user, setUser] = React.useState('');
    const [image, setImage] = useState(null);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const userData = await authService.getUserData();
                    setUser(userData);
    
                    if (userData?.email) {
                        const res = await fetch(`http://10.0.2.2:9000/farmer/getByEmail/${userData.email}`);
                        if (res.ok) {
                            const farmerData = await res.json();
                            console.log("Farmer data:", farmerData);
    
                            // Important: Call setters correctly
                            if (farmerData.profileimage?.base64) {
                                setImage(`data:${farmerData.profileimage.contentType};base64,${farmerData.profileimage.base64}`);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch farmer data", error);
                }
            };
            fetchUserData();
        }, []);
    return (
        <Provider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: 'black',
                    headerRight: () => (
                        <View style={{ marginRight: 10 }}>
                            <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={
                                    <Pressable onPress={openMenu}>
                                        <Image
                                            source={{
                                                uri: image || 'https://i.pravatar.cc/300', // fallback if no DB image
                                            }}
                                            style={{
                                                width: 35,
                                                height: 35,
                                                borderRadius: 16,
                                                backgroundColor: '#ccc',
                                                borderColor: '#000',
                                                borderWidth: 2,
                                            }}
                                        />
                                    </Pressable>
                                }
                            >
                                <Menu.Item onPress={() => { closeMenu(); router.push('/farmers'); }} title="Profile" />
                                <Menu.Item onPress={() => { closeMenu(); router.push('/(components)/create_order'); }} title="create order" />
                                <Menu.Item onPress={() => { closeMenu(); router.push('/(components)'); }} title = "My order"/>
                                <Menu.Item onPress={() => { closeMenu(); router.push('/(auth)'); }} title="Logout" />
                                <Menu.Item title={user?.email || ''} />
                            </Menu>
                        </View>
                    ),
                }}
            >
                {/* bottom tabs */}
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={24} />,
                    }}
                />
                <Tabs.Screen
                    name="farmers"
                    options={{
                        title: 'Cart',
                        tabBarIcon: ({ color }) => <FontAwesome name="cart-plus" color={color} size={24} />,
                    }}
                />
            </Tabs>
        </Provider>
    );
}