import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { useActionContext } from '@/context/ActionContext';

interface Action {
    _id: string; 
    description: string;
}

const DetailScreen: React.FC = () => {
    const { detailId} = useLocalSearchParams();
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addAction } = useActionContext();

    useEffect(() => {
        fetchActions(detailId as string);
    }, [detailId]);

    const fetchActions = async (id: string) => {
        try {
            const response = await apiClient.get(`${API_ENDPOINTS.actions.get_actions_by_device}?deviceId=${id}`);
            if (response.status === 200) {
                setActions(response.data);
            } else {
                throw new Error("Failed to fetch actions");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const renderActionItem = ({ item }: { item: Action }) => (
        <TouchableOpacity style={styles.actionItem} onPress={() => handleActionPress(item)}>
            <Text style={styles.actionDescription}>{item.description}</Text>
        </TouchableOpacity>
    );

    const handleActionPress = (item: Action) => {
        addAction(item);
        router.back();
    };

    const renderContent = () => {
        if (loading) return <ActivityIndicator size="large" color="#6200ea" />;
        if (error) return <Text style={styles.errorText}>{error}</Text>;
        return (
            <FlatList
                data={actions}
                renderItem={renderActionItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.actionsList}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: `Action`,
                    headerTitleAlign: "center"
                }}
            />
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f7f9fc',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    deviceId: {
        fontSize: 18,
        color: '#555',
        marginBottom: 20,
    },
    actionsList: {
        flexGrow: 1,
        width: '100%',
    },
    actionItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        width: '100%', 
        alignItems: 'flex-start', 
    },
    actionDescription: {
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: 'red',
        marginTop: 20,
    },
});

export default DetailScreen;
