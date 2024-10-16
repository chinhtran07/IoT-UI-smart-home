import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { Trigger, useTriggerContext } from '@/context/TriggerContext';
import { Colors } from '@/constants/Colors';

interface Action {
    id: string; 
    description: string;
    property: string;
    value: string;
}

const ActionItem: React.FC<{ item: Action; onPress: (item: Action) => void }> = React.memo(({ item, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={() => onPress(item)}>
        <Text style={styles.actionDescription}>{item.description}</Text>
    </TouchableOpacity>
));

const DetailTriggerOfDevice: React.FC = () => {
    const { detail } = useLocalSearchParams();
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addTrigger } = useTriggerContext();

    const fetchActions = useCallback(async () => {
        if (!detail) return; 
        setLoading(true);
        setError(null); 
        try {
            const response = await apiClient.get(API_ENDPOINTS.devices.get_actions(detail as string));
            if (response.status === 200) {
                setActions(response.data);
            } else {
                throw new Error(`Failed to fetch actions: ${response.statusText}`);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [detail]);

    useEffect(() => {
        fetchActions(); // Corrected to call the function
    }, [fetchActions]);

    const handleActionPress = useCallback((item: Action) => {
        const newTrigger: Trigger = { 
            type: 'device', 
            deviceId: `${detail}`, 
            comparator: "eq", 
            deviceStatus: item.value,
            description: item.description
        };
        addTrigger(newTrigger);
        router.back();
    }, [addTrigger, detail]);

    const renderContent = () => {
        if (loading) return <ActivityIndicator size="large" color="#6200ea" />;
        if (error) return <Text style={styles.errorText}>{error}</Text>;

        return (
            <FlatList
                data={actions}
                renderItem={({ item }) => <ActionItem item={item} onPress={handleActionPress} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.actionsList}
                initialNumToRender={10} 
            />
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Trigger Device",
                    headerStyle: { backgroundColor: Colors.header.color },
                    headerTitleStyle: { color: Colors.dark.text },
                    headerTitleAlign: "center",
                    headerBackVisible: true
                }}
            />
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f7f9fc',
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

export default DetailTriggerOfDevice;
