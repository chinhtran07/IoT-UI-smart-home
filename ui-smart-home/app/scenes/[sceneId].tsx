import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { Action, useActionContext } from '@/context/ActionContext';
import { Button } from 'react-native-paper';
import { Colors } from '@/constants/Colors';

interface Scene {
    id: string;
    actions: Action[];
}

const ActionItem: React.FC<{ item: Action; onDelete: () => void }> = React.memo(({ item, onDelete }) => {
    const renderRightActions = useCallback(() => (
        <View style={styles.deleteButtonContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    ), [onDelete]);

    return (
        <Swipeable key={item.id} renderRightActions={renderRightActions}>
            <View style={styles.actionContainer}>
                <Text style={styles.actionText}>{item.description}</Text>
            </View>
        </Swipeable>
    );
});

const DetailSceneScreen: React.FC = () => {
    const router = useRouter();
    const { sceneId } = useLocalSearchParams();
    const [scene, setScene] = useState<Scene | null>(null);
    const { actions, removeAction, resetActions } = useActionContext();

    const fetchScene = useCallback(async () => {
        try {
            const { data } = await apiClient.get(API_ENDPOINTS.scenes.detailed(sceneId as string));
            setScene(data);
        } catch (error) {
            Alert.alert("Error", "Failed to load scene. Please try again."); // User feedback
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

    const handleActivate = async () => {
        try {
            const res = await apiClient.post(API_ENDPOINTS.scenes.control(sceneId as string));
            if (res.status === 200) {
                Alert.alert("", "Activated");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to activate scene. Please try again."); // User feedback
            console.error(error);
        }
    };

    if (!scene) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Scene Details",
                    headerStyle: { backgroundColor: Colors.header.color },
                    headerTitleStyle: {color: Colors.dark.text},
                    headerTitleAlign: 'center',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveButton}>Save</Text>
                        </TouchableOpacity>
                    ),
                    headerBackVisible: true,
                }}
            />

            <Button style={styles.activateButton} onPress={handleActivate}>
                <Text style={styles.activateButtonText}>Activate</Text>
            </Button>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Actions</Text>
                    {actions.size > 0 ? (
                        <FlatList
                            data={Array.from(actions)}
                            keyExtractor={item => item.id || ""}
                            renderItem={({ item }) => (
                                <ActionItem item={item} onDelete={() => deleteAction(item.id || "")} />
                            )}
                            contentContainerStyle={styles.flatListContainer}
                        />
                    ) : (
                        <Text>No actions available</Text>
                    )}
                    <TouchableOpacity onPress={() => router.push('/actions')}>
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
        borderColor: '#4285F4',
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
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
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
    activateButton: {
        backgroundColor: '#34A853',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    activateButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    flatListContainer: {
        paddingBottom: 10,
    },
});

export default DetailSceneScreen;
