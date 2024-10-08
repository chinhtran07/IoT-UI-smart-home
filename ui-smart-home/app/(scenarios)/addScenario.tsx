import { useActionContext } from '@/context/ActionContext';
import { Trigger, useTriggerContext } from '@/context/TriggerContext';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { IconButton } from 'react-native-paper';

interface Action {
    _id: string;
    description: string;
}

const ConditionItem: React.FC<{ item: Trigger; onDelete: () => void }> = React.memo(({ item, onDelete }) => (
    <Swipeable
        renderRightActions={() => (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        )}
        overshootRight={false}
    >
        <View style={styles.conditionContainer}>
            {item.type === "time" ? (
                <Text style={styles.conditionText}>
                    Time Trigger: {item.startTime} - {item.endTime}
                </Text>
            ) : item.type === "device" ? (
                <Text style={styles.conditionText}>
                    Action: {item.actionId}
                </Text>
            ) : (
                <Text style={styles.conditionText}>
                    Unknown Trigger Type
                </Text>
            )}
        </View>
    </Swipeable>
));

const ActionItem: React.FC<{ item: Action; onDelete: () => void }> = React.memo(({ item, onDelete }) => (
    <Swipeable
        renderRightActions={() => (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        )}
        overshootRight={false}
    >
        <View style={styles.actionContainer}>
            <Text style={styles.actionText}>{item.description}</Text>
        </View>
    </Swipeable>
));

const AddScenarioScreen: React.FC = () => {
    const [executedOnce, setExecutedOnce] = useState(false);
    const route = useRouter();
    const { triggers, removeTrigger, resetTriggers } = useTriggerContext();
    const { actions, removeAction, resetActions } = useActionContext();

    const goToTrigger = () => route.push('/(triggers)');
    const goToAction = () => route.push('/(actions)');

    const handleToggle = () => setExecutedOnce(prev => !prev);

    const handleSave = () => {
        console.log("Scenario saved");
        resetTriggers();
        resetActions();
        route.back();
    };

    const deleteAction = useCallback((_id: string) => {
        removeAction(_id);
    }, [removeAction]);

    const deleteCondition = useCallback((index: number) => {
        removeTrigger(index);
    }, [removeTrigger]);

    return (
        <GestureHandlerRootView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Add Scenario",
                    headerTitleAlign: 'center',
                    headerBackVisible: false,
                    headerLeft: () => (
                        <IconButton
                            icon="arrow-left"
                            size={24}
                            onPress={() => {
                                resetTriggers();
                                resetActions(); // Reset cả actions khi nhấn back
                                route.back();
                            }}
                        />
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveButton}>Save</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={[styles.card, { borderColor: '#4285F4' }]}>
                    <Text style={styles.cardTitle}>IF</Text>
                    {triggers.map((item, index) => (
                        <ConditionItem key={index} item={item} onDelete={() => deleteCondition(index)} />
                    ))}
                    <TouchableOpacity onPress={goToTrigger}>
                        <Text style={styles.addLink}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { borderColor: '#34A853' }]}>
                    <Text style={styles.cardTitle}>THEN</Text>
                    {actions.map(item => (
                        <ActionItem key={item._id} item={item} onDelete={() => deleteAction(item._id)} />
                    ))}
                    <TouchableOpacity onPress={goToAction}>
                        <Text style={styles.addLink}>Add</Text>
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionContainer: {
        padding: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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
    },
});

export default AddScenarioScreen;
