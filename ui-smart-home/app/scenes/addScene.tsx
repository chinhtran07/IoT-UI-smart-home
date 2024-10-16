import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Action, useActionContext } from '@/context/ActionContext'; 
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';

const AddSceneScreen: React.FC = () => {
  const router = useRouter();
  const { actions, removeAction, resetActions } = useActionContext();
  const [sceneName, setSceneName] = useState("");

  const handleSave = async () => {
    if (!sceneName.trim()) {
      Alert.alert("Error", "Please enter a scene name");
      return;
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.scenes.create, {
        name: sceneName,
        actions: Array.from(actions).map(action => action.id),
      });
      
      if (response.status === 201) {
        resetActions();
        Alert.alert("Success", "Scene has been created successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Error creating scene:", error);
      Alert.alert("Error", "Failed to create scene. Please try again.");
    }
  };

  const goToAction = () => {
    router.push("/actions");
  };

  const deleteAction = useCallback((id: string) => {
    removeAction(id);
  }, [removeAction]);

  const renderRightActions = useCallback((id: string) => (
    <View style={styles.deleteButtonContainer}>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAction(id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  ), [deleteAction]);

  const renderActionItem = useCallback((item: Action) => (
    <Swipeable
      key={item.id}
      renderRightActions={() => renderRightActions(item?.id || "")}
    >
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>{item.description}</Text>
      </View>
    </Swipeable>
  ), [renderRightActions]);

  return (
    <GestureHandlerRootView style={styles.container}>
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
        <View style={[styles.card, { borderColor: '#4285F4' }]}>
          <Text style={styles.cardTitle}>Scene Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter scene name"
            value={sceneName}
            onChangeText={setSceneName}
          />
        </View>

        <View style={[styles.card, { borderColor: '#4285F4' }]}>
          <Text style={styles.cardTitle}>Actions</Text>
          {Array.from(actions).map(renderActionItem)}
          <TouchableOpacity onPress={goToAction}>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
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
