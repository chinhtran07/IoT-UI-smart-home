import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { useActionContext } from '@/context/ActionContext';

interface Action {
    id: string;
    description: string;
}

interface Scene {
    id: string;
    actions: Action[];
}

const ActionItem: React.FC<{ item: Action; onDelete: () => void }> = React.memo(({ item, onDelete }) => {
    const renderRightActions = () => (
        <View style={styles.deleteButtonContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Swipeable
            key={item.id}
            renderRightActions={renderRightActions}
        >
            <View style={styles.actionContainer}>
                <Text style={styles.actionText}>{item.description}</Text>
            </View>
        </Swipeable>
    );
});

const DetailSceneScreen: React.FC = () => {
    const router = useRouter();
    const { sceneId } = useLocalSearchParams(); // Destructure params directly
    const [scene, setScene] = useState<Scene | null>(null);
    const { actions, removeAction, resetActions } = useActionContext();

    const fetchScene = useCallback(async () => {
        try {
            const fetchedScene = await apiClient.get(API_ENDPOINTS.scenes.detailed(sceneId as string));
            setScene(fetchedScene.data);
        } catch (error) {
            console.error(error);
        }
    }, [sceneId]);

    useEffect(() => {
        fetchScene();
    }, [fetchScene]);

    const handleSave = () => {
        resetActions();
        router.back();
    };

    const deleteAction = useCallback((id: string) => {
        removeAction(id);
    }, [removeAction]);

    if (!scene) {
        return <Text>Loading...</Text>;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Scene Details",
                    headerTitleAlign: 'center',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveButton}>Save</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={[styles.card, { borderColor: '#4285F4' }]}>
                    <Text style={styles.cardTitle}>Actions</Text>
                    {actions.size > 0 ? (
                        Array.from(actions).map(item => (
                            <ActionItem key={item.id} item={item} onDelete={() => deleteAction(item.id)} />
                        ))
                    ) : (
                        <Text>No actions available</Text>
                    )}
                    <TouchableOpacity onPress={() => router.push('/(actions)')}>
                        <Text style={styles.addLink}>Add</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        padding: 20,
    },
    card: {
        borderWidth: 3,
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        marginBottom: 10,
    },
    actionText: {
        fontSize: 16,
        flex: 1,
    },
    deleteButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: 100,
        height: '100%',
        borderRadius: 5,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addLink: {
        fontSize: 16,
        color: '#4285F4',
        marginTop: 10,
    },
    saveButton: {
        fontSize: 16,
        color: '#4285F4',
        marginRight: 15,
    },
});

export default DetailSceneScreen;
