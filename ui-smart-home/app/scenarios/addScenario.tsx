import { API_ENDPOINTS } from "@/configs/apiConfig";
import { Action, useActionContext } from "@/context/ActionContext";
import { Trigger, useTriggerContext } from "@/context/TriggerContext";
import apiClient from "@/services/apiService";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";

const SwipeableItem: React.FC<{
  onDelete: () => void;
  children: React.ReactNode;
}> = React.memo(({ onDelete, children }) => (
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

const ConditionItem: React.FC<{ item: Trigger; onDelete: () => void }> =
  React.memo(({ item, onDelete }) => (
    <SwipeableItem onDelete={onDelete}>
      <View style={styles.conditionContainer}>
        <Text style={styles.conditionText}>
          {item.type === "time"
            ? `Time Trigger: ${item.startTime} - ${item.endTime}`
            : item.type === "device"
            ? `Action: ${item.description}`
            : "Unknown Trigger Type"}
        </Text>
      </View>
    </SwipeableItem>
  ));

const ActionItem: React.FC<{ item: Action; onDelete: () => void }> = React.memo(
  ({ item, onDelete }) => (
    <SwipeableItem onDelete={onDelete}>
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>{item.description}</Text>
      </View>
    </SwipeableItem>
  )
);

const AddScenarioScreen: React.FC = () => {
  const [executedOnce, setExecutedOnce] = useState(false);
  const [scenarioName, setScenarioName] = useState(""); // State for scenario name
  const route = useRouter();
  const { triggers, removeTrigger, resetTriggers } = useTriggerContext();
  const { actions, removeAction, resetActions } = useActionContext();

  const goToTrigger = () => route.push("/triggers");
  const goToAction = () => route.push("/actions");

  const handleToggle = () => setExecutedOnce((prev) => !prev);

  const handleSave = async () => {
    const data = {
      name: scenarioName, // Use the entered scenario name
      isEnabled: true,
      triggers,
      actions: Array.from(actions).map((action) => action.id),
    };

    console.log(triggers);

    try {
      const res = await apiClient.post(API_ENDPOINTS.scenarios.create, data);

      if (res.status === 201) {
        // Only reset triggers and actions if the API call is successful
        resetTriggers();
        resetActions();
        route.back(); // Navigate back after successful save
      } else {
        console.error("Failed to save scenario:", res.status);
      }
    } catch (error) {
      console.error("Error saving scenario:", error);
      // You can add some user feedback or error notification here
    }
  };

  const deleteAction = useCallback(
    (id: string) => {
      removeAction(id);
    },
    [removeAction]
  );

  const deleteCondition = useCallback(
    (index: number) => {
      removeTrigger(index);
    },
    [removeTrigger]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Add Scenario",
          headerTitleAlign: "center",
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
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Scenario Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter scenario name"
            value={scenarioName}
            onChangeText={setScenarioName}
          />
        </View>

        <View style={[styles.card, { borderColor: "#4285F4" }]}>
          <Text style={styles.cardTitle}>IF</Text>
          {triggers.map((item, index) => (
            <ConditionItem
              key={item.id || index}
              item={item}
              onDelete={() => deleteCondition(index)}
            />
          ))}
          <TouchableOpacity onPress={goToTrigger}>
            <Text style={styles.addLink}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { borderColor: "#34A853" }]}>
          <Text style={styles.cardTitle}>THEN</Text>
          {Array.from(actions).map((item) => (
            <ActionItem
              key={item.id}
              item={item}
              onDelete={() => deleteAction(item.id || "1")}
            />
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
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    padding: 20,
    paddingBottom: 80,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  card: {
    borderWidth: 3,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  conditionContainer: {
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    marginBottom: 10,
    elevation: 5,
  },
  actionContainer: {
    padding: 10,
    backgroundColor: "#F0F0F0",
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
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addLink: {
    fontSize: 16,
    color: "#4285F4",
    marginTop: 10,
  },
  previewSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  toggleLabel: {
    fontSize: 16,
  },
  toggleDescription: {
    color: "#777",
    fontSize: 14,
  },
  saveButton: {
    marginRight: 15,
    fontSize: 16,
    color: "#4285F4",
  },
});

export default AddScenarioScreen;
