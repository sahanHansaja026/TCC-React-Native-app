import {
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Switch,
    Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React, { use, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import authService from "../services/authService"; // your auth service

export default function AddToMarketplace() {
    const [user, setUser] = useState(null);
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [Discount, setDiscount] = useState("");
    const [availableUntil, setAvailableUntil] = useState("");
    const [location, setLocation] = useState("");
    const [groupSale, setGroupSale] = useState(false);
    const [image, setImage] = useState(null);
    const [Discription, setDiscription] = useState("");
    const [groupSaleDetails, setGroupSaleDetails] = useState("");
    const [minMembers, setMinMembers] = useState("");
    const [maxMembers, setMaxMembers] = useState("");
    const [groupExpireDate, setGroupExpireDate] = useState("");


    useEffect(() => {
        const fetchUser = async () => {
            const userData = await authService.getUserData();
            setUser(userData);
        };
        fetchUser();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
    if (!product || !quantity || !price || !Discount || !availableUntil || !location || !Discription  || !user?.email) {
        Alert.alert("Error", "Please fill all fields.");
        return;
    }

    if (groupSale) {
        if (!minMembers || !maxMembers || !groupExpireDate) {
            Alert.alert("Error", "Please fill all group sale fields.");
            return;
        }
    }

    const formData = new FormData();
    formData.append("product", product);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("Discount", Discount);
    formData.append("availableUntil", availableUntil);
    formData.append("location", location);
    formData.append("groupSale", groupSale ? "true" : "false");
    formData.append("email", user.email);
    formData.append("Discription", Discription);

    // ✅ Append group sale details if enabled
    if (groupSale) {
        formData.append("minMembers", minMembers);
        formData.append("maxMembers", maxMembers);
        formData.append("groupExpireDate", groupExpireDate);
    }

    // ✅ Append image if selected
    if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const ext = match?.[1] ?? "jpg";
        const type = `image/${ext}`;

        formData.append("image", {
            uri: image,
            name: filename,
            type,
        });
    }

    try {
        const response = await fetch("http://10.0.2.2:9000/order/create/save", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formData,
        });

        if (!response.ok) {
            const errText = await response.text();
            Alert.alert("Server Error", errText);
            return;
        }

        const result = await response.json();
        Alert.alert("Success", result.success || "Order posted!");
    } catch (error) {
        Alert.alert("Network Error", error.message);
    }
};


    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.heading}>Add Product to Marketplace</Text>

                        <Text style={styles.label}>Product Name {" "}<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input} onChangeText={setProduct} value={product} placeholder="e.g., My Product" />

                        <Text style={styles.label}>Quantity (kg,Count,othor){" "}<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={setQuantity} value={quantity} placeholder="e.g., 100" />

                        <Text style={styles.label}>Price per unit (LKR){" "}<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={setPrice} value={price} placeholder="e.g., 120" />

                        <Text style={styles.label}>Discount with Per Unit Price (LKR){" "}<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={setDiscount} value={Discount} placeholder="e.g., 100" />

                        <Text style={styles.label}>Discription{" "}<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}  // You can adjust the height as needed
                            onChangeText={setDiscription}
                            value={Discription}
                            placeholder="e.g., this product is ...."
                            multiline={true}
                        />

                        <Text style={styles.label}>Available Until{" "}<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input} onChangeText={setAvailableUntil} value={availableUntil} placeholder="YYYY-MM-DD" />

                        <Text style={styles.label}>Pickup Location{" "}<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}  // You can adjust the height as needed
                            onChangeText={setLocation}
                            value={location}
                            placeholder="e.g., No. 23, Kandy Road"
                            multiline={true}
                        />

                        <Text style={styles.label}>Upload Image</Text>
                        {image && <Image source={{ uri: image }} style={styles.image} />}
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                                <Text style={styles.textbtn}>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
                                <Text style={styles.textbtn}>Camera</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Group Sale Option</Text>
                            <Switch
                                value={groupSale}
                                onValueChange={setGroupSale}
                                trackColor={{ false: '#ccc', true: '#000' }}
                                thumbColor={groupSale ? '#fff' : '#fff'}
                            />
                        </View>

                        {groupSale && (
                            <>
                                <Text style={styles.label}>Minimum Members{" "}<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onChangeText={setMinMembers}
                                    value={minMembers}
                                    placeholder="e.g., 5"
                                />

                                <Text style={styles.label}>Maximum Members{" "}<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    onChangeText={setMaxMembers}
                                    value={maxMembers}
                                    placeholder="e.g., 20"
                                />

                                <Text style={styles.label}>Group Expire Date{" "}<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setGroupExpireDate}
                                    value={groupExpireDate}
                                    placeholder="YYYY-MM-DD"
                                />
                            </>
                        )}


                        <TouchableOpacity style={styles.submitbtn} onPress={handleSubmit}>
                            <Text style={styles.textsubmit}>Submit Order</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        marginBottom: 6
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    submitbtn: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#000",
        marginBottom: 150,
    },
    textsubmit: { color: "#000", fontSize: 16, fontWeight: "bold" },
    text: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    textbtn: { color: "#000", fontSize: 16, fontWeight: "bold" },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        alignSelf: "center",
        marginVertical: 10,
    },
    imageBtn: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#000",
    },
    required: {
        color: '#FF0000',
        fontSize: 16,
    }
});
