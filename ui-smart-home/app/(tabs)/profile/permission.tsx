import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";

interface Device {
    id: string;
    name: string;
}

const PermissionScreen: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const router = useRouter();

    // Fetch devices with useCallback to avoid unnecessary re-creation
    const fetchDevices = useCallback(async () => {
        try {
            const { status, data } = await apiClient.get(API_ENDPOINTS.devices.by_owner);
            if (status === 200) {
                const formattedDevices = data.data.map((device: any) => ({
                    id: device.id,
                    name: device.name,
                }));
                setDevices(formattedDevices);
            } else {
                console.error("Failed to fetch devices:", data);
            }
        } catch (error) {
            console.error("Error fetching devices:", error);
        }
    }, []);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const renderItem = ({ item }: { item: Device }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity style={styles.permissionsButton}>
                <Text style={styles.permissionsButtonText}>Manage Permissions</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Permission",
                    headerTitleAlign: "center",
                    headerBackVisible: true,
                    headerBackTitleVisible: false,
                }}
            />
            <FlatList
                data={devices}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>No devices available</Text>}
            />
            <TouchableOpacity style={styles.addDeviceButton} onPress={() => router.push("/devices/addDevice")}>
                <Text style={styles.addDeviceButtonText}>Add Device</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f0f4f8", // Light background for better contrast
    },
    listContainer: {
        paddingBottom: 20,
    },
    itemContainer: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: "#ffffff", // Card background color
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    itemName: {
        fontSize: 18,
        fontWeight: "600", // Slightly bolder text for better visibility
        color: "#333", // Dark text color for better contrast
    },
    permissionsButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#007BFF", // Blue background for action button
        borderRadius: 5,
        alignItems: "center",
    },
    permissionsButtonText: {
        color: "#ffffff", // White text for better visibility
        fontWeight: "bold",
    },
    emptyText: {
        fontSize: 18,
        color: "#888",
        textAlign: "center",
        marginTop: 50,
    },
    addDeviceButton: {
        padding: 15,
        backgroundColor: "#28a745", // Green background for the add button
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    addDeviceButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default PermissionScreen;
