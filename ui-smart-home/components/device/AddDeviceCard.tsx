import React from 'react'; // Import React
import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, Dimensions, StyleSheet } from "react-native"; // Import necessary components
import { Card } from "react-native-paper"; 
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AddDeviceCard() {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push("/devices/addDevice")}>
            <Card style={styles.card}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="add" size={40} color="white" />
                </View>
                <Card.Content style={styles.cardContent}>
                    <Text style={styles.text}>Add Device</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 3; // Adjust card width as needed

const styles = StyleSheet.create({
    container: {
        width: '50%', // Adjust to your design
        padding: 10,
    },
    card: {
        borderRadius: 10,
        aspectRatio: 1,
        backgroundColor: 'rgba(255,255,255, 0.2)', // Card background
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    iconWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Icon background
        borderRadius: 30,
        padding: 10,
        position: 'absolute',
        bottom: 40,
    },
    cardContent: {
        bottom: -60, // Adjust as needed
        alignItems: 'center',
        padding: 10,
        right: 20,
    },
    text: {
        color: 'white', // Text color
        fontSize: 20,
        textAlign: 'center',
        fontWeight: "700",
    },
});
