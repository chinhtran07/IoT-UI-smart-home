import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';

interface Device {
    id: string;
    name: string; // Adjust based on your actual device structure
}

const ActionListScreen: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const router = useRouter();

    const fetchDevices = useCallback(
        async (pageNum: number) => {
            if (loading || !hasMore) return;

            setLoading(true);
            try {
                const res = await apiClient.get(`${API_ENDPOINTS.devices.by_owner}?page=${pageNum}`);
                if (res.status === 200) {
                    const { devices: newDevices, totalPages } = res.data;
                    setDevices((prevDevices) => [...prevDevices, ...newDevices]);
                    setHasMore(pageNum < totalPages);
                } else {
                    console.error("Failed to fetch devices");
                }
            } catch (error) {
                console.error("Error fetching devices:", error);
            } finally {
                setLoading(false);
            }
        },
        [loading, hasMore]
    );

    useEffect(() => {
        fetchDevices(page);
    }, [page, fetchDevices]);

    const loadMore = () => {
        if (hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    const handleItemPress = (id: string) => {
        // Navigate to the detail page with the device ID
        router.push(`/(actions)/${id}`);
    };

    const renderItem = ({ item }: { item: Device }) => (
        <TouchableOpacity style={styles.actionItem} onPress={() => handleItemPress(item.id)}>
            <Text style={styles.actionText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerBackVisible: true,
                    headerTitle: "Action"
                }}
            />
            <FlatList
                data={devices}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={<Text style={styles.emptyText}>No devices found.</Text>}
                ListFooterComponent={loading ? <ActivityIndicator /> : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    list: {
        paddingBottom: 20,
    },
    actionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 10,
    },
    actionText: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default ActionListScreen;
