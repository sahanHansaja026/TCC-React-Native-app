import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

export default function ProductDetailScreen({ route }) {
    const { product } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
            <Button title="Add to Cart" onPress={() => { }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    image: { width: '100%', height: 250, borderRadius: 8 },
    name: { fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
    price: { color: '#f60', fontSize: 18 },
    description: { marginVertical: 12, fontSize: 14, color: '#555' },
});
