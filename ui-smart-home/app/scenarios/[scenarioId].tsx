import { API_ENDPOINTS } from '@/configs/apiConfig';
import { Action, useActionContext } from '@/context/ActionContext';
import { Trigger, useTriggerContext } from '@/context/TriggerContext';
import apiClient from '@/services/apiService';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { IconButton } from 'react-native-paper';

interface Scenario {
    id: string;
    triggers: Trigger[];
    actions: Set<Action>;
    executedOnce: boolean;
}

interface SwipeableItemProps {
    onDelete: () => void;
    children: React.ReactNode;
}

const SwipeableItem: React.FC<SwipeableItemProps> = React.memo(({ onDelete, children }) => (
    <Swipeable
        renderRightActions={() => (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        )}
        overshootRight={false}
    >
        {children}
    </Swipeable>
));

const ConditionItem: React.FC<{ item: Trigger; onDelete: () => void }> = React.memo(({ item, onDelete }) => (
    <SwipeableItem onDelete={onDelete}>
        <View style={styles.conditionContainer}>
            <Text style={styles.conditionText}>
                {item.type === "time"
                    ? `Time Trigger: ${item.startTime} - ${item.endTime}`
                    : item.type === "device"
                        ? `Action: ${item.deviceId}`
                        : "Unknown Trigger Type"}
            </Text>
        </View>
    </SwipeableItem>
));

const ActionItem: React.FC<{ item: Action; onDelete: () => void }> = React.memo(({ item, onDelete }) => (
    <SwipeableItem onDelete={onDelete}>
        <View style={styles.actionContainer}>
            <Text style={styles.actionText}>{item.description}</Text>
        </View>
    </SwipeableItem>
));

const DetailScenarioScreen: React.FC = () => {
    const [executedOnce, setExecutedOnce] = useState(false);
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [loading, setLoading] = useState(true);
    const route = useRouter();
    const params = useGlobalSearchParams();
    const scenarioId = Array.isArray(params.scenarioId) ? params.scenarioId[0] : params.scenarioId;
    const { triggers, removeTrigger, resetTriggers, setTriggers } = useTriggerContext();
    const { actions, removeAction, resetActions, setActions } = useActionContext();

    const fetchScenario = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get(API_ENDPOINTS.scenarios.detailed(scenarioId));
            setScenario(data);
            setTriggers(data.triggers);
            setActions(data.actions);
        } catch (error) {
            console.error("Failed to fetch scenario:", error);
        } finally {
            setLoading(false);
        }
    }, [scenarioId, setTriggers, setActions]);

    useEffect(() => {
        fetchScenario();
    }, [fetchScenario]);

    const handleToggle = useCallback(() => setExecutedOnce(prev => !prev), []);

    const handleSave = useCallback(async () => {
        if (!scenario) return;

        const updatedScenario = { ...scenario, triggers, actions, executedOnce };

        try {
            const res = await apiClient.put(API_ENDPOINTS.scenarios.update(scenarioId), updatedScenario);
            if (res.status === 204) {
                resetTriggers();
                resetActions();
                route.back();
            }
        } catch (error) {
            console.error("Failed to update scenario:", error);
        }
    }, [scenario, triggers, actions, executedOnce, scenarioId, resetTriggers, resetActions, route]);

    const deleteAction = useCallback((id: string) => removeAction(id), [removeAction]);

    const deleteCondition = useCallback((index: number) => removeTrigger(index), [removeTrigger]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (!scenario) {
        return <Text>Error loading scenario.</Text>;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Scenario Details",
                    headerTitleAlign: 'center',
                    headerBackVisible: false,
                    headerLeft: () => (
                        <IconButton
                            icon="arrow-left"
                            size={24}
                            onPress={() => {
                                resetTriggers();
                                resetActions();
                                route.back();
                            }}
                        />
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveButton}>Update</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={[styles.card, { borderColor: '#4285F4' }]}>
                    <Text style={styles.cardTitle}>IF</Text>
                    {triggers.length > 0 ? triggers.map((item, index) => (
                        <ConditionItem key={index} item={item} onDelete={() => deleteCondition(index)} />
                    )) : <Text>No conditions</Text>}
                    <TouchableOpacity onPress={() => route.push('/triggers')}>
                        <Text style={styles.addLink}>Add Condition</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { borderColor: '#34A853' }]}>
                    <Text style={styles.cardTitle}>THEN</Text>
                    {actions.size > 0 ? Array.from(actions).map(item => (
                        <ActionItem key={item.id} item={item} onDelete={() => deleteAction(item.id || "")} />
                    )) : <Text>No actions</Text>}
                    <TouchableOpacity onPress={() => route.push('/actions')}>
                        <Text style={styles.addLink}>Add Action</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.previewSection}>
                    <Text style={styles.previewTitle}>Preview</Text>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Executed once</Text>
                        <Switch value={executedOnce} onValueChange={handleToggle} />
                    </View>
                    <Text style={styles.toggleDescription}>
                        Executed once, and then automation turns off
                    </Text>
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
        paddingBottom: 80,
    },
    card: {
        borderWidth: 3,
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    conditionContainer: {
        padding: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        marginBottom: 10,
        elevation: 5,
    },
    actionContainer: {
        padding: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        marginBottom: 10,
        elevation: 5,
    },
    conditionText: {
        fontSize: 16,
    },
    actionText: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        borderRadius: 5,
        marginLeft: 10,
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
    previewSection: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    toggleLabel: {
        fontSize: 16,
    },
    toggleDescription: {
        color: '#777',
        fontSize: 14,
    },
    saveButton: {
        marginRight: 15,
        fontSize: 16,
        color: '#4285F4',
        fontWeight: 'bold',
    },
});

export default DetailScenarioScreen;
