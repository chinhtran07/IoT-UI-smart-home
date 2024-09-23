import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Modal, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const availableDevices = [
  { id: '1', name: 'Device 1' },
  { id: '2', name: 'Device 2' },
  { id: '3', name: 'Device 3' },
  { id: '4', name: 'Device 4' },
];

const AddGroupDeviceScreen: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const router = useRouter();

  const handleConfirm = () => {
    setModalVisible(true);
  };

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevices((prev) => 
      prev.includes(deviceId) ? prev.filter(id => id !== deviceId) : [...prev, deviceId]
    );
  };

  const handleSave = () => {
    console.log("Group Name:", groupName);
    console.log("Selected Devices:", selectedDevices);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header tùy chỉnh */}
      <View style={styles.header}>
        <Text style={styles.backButton} onPress={() => router.back()}>
          ←
        </Text>
        <Text style={styles.headerTitle}>Add Group Device</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Button title="Confirm" onPress={handleConfirm} />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Devices</Text>
          <FlatList
            data={availableDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.deviceItem, selectedDevices.includes(item.id) && styles.selectedDevice]}
                onPress={() => handleDeviceSelect(item.id)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Save Group" onPress={handleSave} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
      alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedDevice: {
    backgroundColor: '#e0e0e0',
  },
});

export default AddGroupDeviceScreen;
