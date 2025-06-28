import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import authService from "../services/authService";
import { router } from 'expo-router';

export default function Farmers() {
    const [name, onChangeName] = useState('');
    const [nicnumber, onChangeNICnumber] = useState('');
    const [address, onChangeAddress] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [contact, setContact] = useState('');
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);

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

                        onChangeName(farmerData.name || '');
                        onChangeNICnumber(farmerData.nicnumber || '');
                        onChangeAddress(farmerData.address || '');
                        setSelectedDistrict(farmerData.selectedDistrict || '');
                        setContact(farmerData.contact || '');

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

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: false,
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Camera permission is required!");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: false,
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        const email = user?.email?.trim();

        const isEmpty = !name || !email || !nicnumber || !address || !selectedDistrict || !contact;
        if (isEmpty) {
            alert("Please fill all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("email", email);
        formData.append("nicnumber", nicnumber.trim());
        formData.append("address", address.trim());
        formData.append("selectedDistrict", selectedDistrict.trim());
        formData.append("contact", contact.trim());

        if (image) {
            const filename = image.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const ext = match?.[1];
            const type = `image/${ext}`;

            formData.append("profileimage", {
                uri: image,
                name: filename,
                type,
            });
        }

        try {
            const response = await fetch("http://10.0.2.2:9000/farmer/updateOrSave", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert("Details saved successfully!");
                router.push("/(tab)");
            } else {
                console.error("Backend error:", result);
                alert(result.message || "Failed to save details.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                {user?.email && <Text style={styles.label}>Logged in as: {user.email}</Text>}

                <Text style={styles.label}>Name:</Text>
                <TextInput style={styles.input} onChangeText={onChangeName} value={name} placeholder="Name" />

                <Text style={styles.label}>NIC Number:</Text>
                <TextInput style={styles.input} onChangeText={onChangeNICnumber} value={nicnumber} placeholder="NIC Number" keyboardType="numeric" />

                <Text style={styles.label}>Address:</Text>
                <TextInput style={styles.descriptionInput} onChangeText={onChangeAddress} value={address} placeholder="Address" multiline numberOfLines={6} textAlignVertical="top" />

                <Text style={styles.label}>Select District:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={selectedDistrict} onValueChange={(itemValue) => setSelectedDistrict(itemValue)}>
                        <Picker.Item label="Select District" value="" />
                        <Picker.Item label="Colombo" value="Colombo" />
                        <Picker.Item label="Gampaha" value="Gampaha" />
                        <Picker.Item label="Kandy" value="Kandy" />
                        <Picker.Item label="Galle" value="Galle" />
                        <Picker.Item label="Matara" value="Matara" />
                        <Picker.Item label="Jaffna" value="Jaffna" />
                    </Picker>
                </View>

                <Text style={styles.label}>Contact Number:</Text>
                <TextInput style={styles.input} onChangeText={setContact} value={contact} placeholder="Contact Number" keyboardType="numeric" />

                <Text style={styles.label}>Profile Image:</Text>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }}>
                    <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                        <Text style={styles.text}>Upload Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
                        <Text style={styles.text}>Take Photo</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
                    <Text style={styles.text}>Save Details</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 6,
    },
    label: {
        marginLeft: 12,
        marginBottom: 2,
        fontSize: 18,
        color: '#000',
    },
    descriptionInput: {
        height: 120,
        margin: 12,
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        marginHorizontal: 12,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#ccc',
    },
    submitbtn: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 12,
    },
    imageBtn: {
        backgroundColor: '#2ecc71',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: 150,
        height: 150,
        marginVertical: 10,
        alignSelf: 'center',
        borderRadius: 8,
    },
});
