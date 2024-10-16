import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { Action, useActionContext } from '@/context/ActionContext';

const colors = {
    background: '#f7f9fc',
    primary: '#6200ea',
    textPrimary: '#333',
    textSecondary: '#555',
    white: '#ffffff',
    error: 'red',
};

const DetailScreen: React.FC = () => {
    const { detail } = useLocalSearchParams();
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addAction } = useActionContext();

    useEffect(() => {
        fetchActions(detail as string);
    }, [detail]);

    const fetchActions = async (id: string) => {
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
    };

    const handleActionPress = (item: Action) => {
        addAction(item);
        router.back();
    };

    const renderActionItem = ({ item }: { item: Action }) => (
        <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => handleActionPress(item)} 
            accessibilityLabel={`Select ${item.description}`} 
            accessibilityRole="button"
        >
            <Text style={styles.actionDescription}>{item.description}</Text>
        </TouchableOpacity>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading actions...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => fetchActions(detail as string)} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <FlatList
                data={actions}
                renderItem={renderActionItem}
                keyExtractor={(item) => item.id || String(Math.random())}
                contentContainerStyle={styles.actionsList}
                showsVerticalScrollIndicator={false} // Hides the vertical scroll indicator
            />
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: `Action`,
                    headerTitleAlign: "center",
                    headerBackVisible: true,
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
        backgroundColor: colors.background,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    actionsList: {
        flexGrow: 1,
        width: '100%',
        paddingBottom: 16, // Add some padding at the bottom
    },
    actionItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: colors.white,
        borderRadius: 8,
        elevation: 3, // Slightly increased elevation for a better shadow effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        width: '100%',
        alignItems: 'flex-start',
    },
    actionDescription: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500', // Slightly increased font weight for better readability
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: colors.error,
        marginTop: 20,
        fontSize: 16,
        fontWeight: '600',
    },
    retryButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 5,
        alignItems: 'center',
    },
    retryButtonText: {
        color: colors.white,
        fontWeight: 'bold',
    },
});

export default DetailScreen;
