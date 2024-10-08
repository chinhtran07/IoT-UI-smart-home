import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useActionContext } from '@/context/ActionContext'; // Import context

const AddSceneScreen: React.FC = () => {
  const router = useRouter();
  const { actions, removeAction, resetActions } = useActionContext(); // Lấy phương thức từ ActionContext

  const handleSave = () => {

    resetActions();
    router.back(); // Điều hướng quay lại
  };

  const goToAction = () => {
    router.push("/(actions)"); // Điều hướng tới trang actions
  };

  // Cập nhật hàm xóa để sử dụng `_id`
  const deleteAction = (id: string) => {
    removeAction(id); // Sử dụng removeAction từ context để xóa action theo _id
  };

  const renderRightActions = (id: string) => {
    return (
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAction(id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Cập nhật để sử dụng _id thay vì id
  const renderActionItem = (item: { _id: string; description: string }) => {
    return (
      <Swipeable
        key={item._id} // Sử dụng _id làm key
        renderRightActions={() => renderRightActions(item._id)}
        onSwipeableOpen={() => console.log('Swipe opened')}
        onSwipeableClose={() => console.log('Swipe closed')}
      >
        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>{item.description}</Text>
        </View>
      </Swipeable>
    );
  };

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
          <Text style={styles.cardTitle}>Actions</Text>
          {actions.map(renderActionItem)} 
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
