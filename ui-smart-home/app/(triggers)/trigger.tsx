import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { Trigger, useTriggerContext } from '@/context/TriggerContext';

interface Action {
    id: string; 
    description: string;
    property: string;
    value: string;
}

const TriggerScreen: React.FC = () => {
    const { deviceId, deviceName } = useLocalSearchParams();
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addTrigger } = useTriggerContext();

    useEffect(() => {
        if (deviceId) {
            fetchActions(deviceId as string);
        }
    }, [deviceId]);

    const fetchActions = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const response = await apiClient.get(API_ENDPOINTS.devices.get_actions(id));
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
    }, []);

    const handleActionPress = useCallback((item: Action) => {
        const newTrigger: Trigger = { type: 'device', deviceId: `${deviceId}`, comparator: "eq", deviceStatus: item.value };
        addTrigger(newTrigger);
        router.replace("/(scenarios)/addScenario");
    }, [addTrigger]);

    const renderActionItem = ({ item }: { item: Action }) => (
        <TouchableOpacity style={styles.actionItem} onPress={() => handleActionPress(item)}>
            <Text style={styles.actionDescription}>{item.description}</Text>
        </TouchableOpacity>
    );

    const renderContent = () => {
        if (loading) return <ActivityIndicator size="large" color="#6200ea" />;
        if (error) return <Text style={styles.errorText}>{error}</Text>;
        return (
            <FlatList
                data={actions}
                renderItem={renderActionItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.actionsList}
                initialNumToRender={10} // Chỉ tải 10 mục đầu tiên để cải thiện hiệu suất
            />
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: `${deviceName}`,
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

export default TriggerScreen;
