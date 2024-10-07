import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

const mockData = [
  { id: 1, action: 'Turn on the lights' },
  { id: 2, action: 'Play music' },
];

const AddSceneScreen: React.FC = () => {
  const [actions, setActions] = useState(mockData);
  const router = useRouter();

  const handleSave = () => {
    // Xử lý logic lưu tại đây
    console.log("Scene saved!");
    // Điều hướng quay lại
    router.back();
  };

  const deleteAction = (id: number) => {
    setActions(actions.filter(action => action.id !== id));
  };

  const renderRightActions = () => {
    return (
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderActionItem = (item: { id: number, action: string }) => {
    return (
      <Swipeable
        key={item.id}
        renderRightActions={() => renderRightActions()}
        onSwipeableOpen={() => console.log('Swipe opened')}
        onSwipeableClose={() => console.log('Swipe closed')}
      >
        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>{item.action}</Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Stack.Screen configuration */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Add Scene",
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Action Section */}
        <View style={[styles.card, { borderColor: '#4285F4' }]}>
          <Text style={styles.cardTitle}>Actions</Text>
          {actions.map(renderActionItem)}
          <TouchableOpacity>
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
    justifyContent: 'space-between',
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

export default AddSceneScreen;
