import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

const mockData = {
  ifConditions: [
    { id: 1, condition: 'Temperature is above 30°C' },
    { id: 2, condition: 'Motion detected' },
  ],
  thenActions: [
    { id: 1, action: 'Turn on the air conditioner' },
    { id: 2, action: 'Send a notification' },
  ],
};

const AddScenarioScreen: React.FC = () => {
  const [executedOnce, setExecutedOnce] = useState(false);
  const [ifConditions, setIfConditions] = useState(mockData.ifConditions);
  const [thenActions, setThenActions] = useState(mockData.thenActions);
  const route = useRouter();

  const handleToggle = () => setExecutedOnce(!executedOnce);

  const handleSave = () => {
    // Implement your save logic here
      console.log("Scenario saved");
      route.back();
  };

  const renderRightAction = (text: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>{text}</Text>
    </TouchableOpacity>
  );

  const deleteCondition = (id: number) => {
    setIfConditions(ifConditions.filter(condition => condition.id !== id));
  };

  const deleteAction = (id: number) => {
    setThenActions(thenActions.filter(action => action.id !== id));
  };

  const renderConditionItem = (item: { id: number, condition: string }) => (
    <Swipeable
      key={item.id}
      renderRightActions={() => renderRightAction('Delete', () => deleteCondition(item.id))}
      overshootRight={false}
    >
      <View style={styles.conditionContainer}>
        <Text style={styles.conditionText}>{item.condition}</Text>
      </View>
    </Swipeable>
  );

  const renderActionItem = (item: { id: number, action: string }) => (
    <Swipeable
      key={item.id}
      renderRightActions={() => renderRightAction('Delete', () => deleteAction(item.id))}
      overshootRight={false}
    >
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>{item.action}</Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Stack.Screen configuration */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Add Scenario",
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          )
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* IF Section */}
        <View style={[styles.card, { borderColor: '#4285F4' }]}>
          <Text style={styles.cardTitle}>IF</Text>
          {ifConditions.map(renderConditionItem)}
          <TouchableOpacity>
            <Text style={styles.addLink}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* THEN Section */}
        <View style={[styles.card, { borderColor: '#34A853' }]}>
          <Text style={styles.cardTitle}>THEN</Text>
          {thenActions.map(renderActionItem)}
          <TouchableOpacity>
            <Text style={styles.addLink}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Preview Section */}
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
    paddingBottom: 80, // Thêm khoảng cách phía dưới cho nội dung
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
