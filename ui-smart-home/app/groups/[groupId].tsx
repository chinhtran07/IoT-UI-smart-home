import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button as PaperButton, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";

interface Device {
  id: string;
  name: string;
}

const DeviceItem: React.FC<{
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ device, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[styles.deviceItem, isSelected && styles.selectedDevice]}
    onPress={onSelect}
  >
    <Text style={styles.deviceName}>{device.name}</Text>
  </TouchableOpacity>
);

const DetailGroupScreen: React.FC<{}> = () => {
  const [groupName, setGroupName] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;
  const router = useRouter();

  const fetchGroupDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(API_ENDPOINTS.groups.detailed(groupId));
      if (response.status === 200) {
        const { name, icon, Devices = [] } = response.data;
        setGroupName(name);
        setGroupImage(icon);
        setDevices(Devices);
      } else {
        Alert.alert("Error", "Failed to fetch group details.");
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
      Alert.alert("Error", "An error occurred while fetching group details.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevices((prev) => {
      const updatedSelection = new Set(prev);
      if (updatedSelection.has(deviceId)) {
        updatedSelection.delete(deviceId);
      } else {
        updatedSelection.add(deviceId);
      }
      return updatedSelection;
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", groupName);

      if (groupImage) {
        const fileType = groupImage.split(".").pop();
        formData.append("icon", {
          uri: groupImage,
          name: `image-${groupName}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const updateGroupResponse = await apiClient.put(
        API_ENDPOINTS.groups.update(groupId),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (updateGroupResponse.status === 200) {
        Alert.alert("Success", "Group updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update group.");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      Alert.alert("Error", "An error occurred while saving the group.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const handleAddDevices = async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.groups.add_device(groupId), { devicesIds: Array.from(selectedDevices) });
      if (response.status === 200) {
        Alert.alert("Success", "Devices added successfully!");
        fetchGroupDetails(); // Refresh group details
      } else {
        Alert.alert("Error", "Failed to add devices.");
      }
    } catch (error) {
      console.error("Error adding devices:", error);
      Alert.alert("Error", "An error occurred while adding devices.");
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    Alert.alert(
      "Remove Device",
      "Are you sure you want to remove this device from the group?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await apiClient.post(API_ENDPOINTS.groups.remove_device(groupId), { deviceIds: [deviceId] });
              if (response.status === 200) {
                Alert.alert("Success", "Device removed successfully!");
                fetchGroupDetails(); // Refresh group details
              } else {
                Alert.alert("Error", "Failed to remove device.");
              }
            } catch (error) {
              console.error("Error removing device:", error);
              Alert.alert("Error", "An error occurred while removing the device.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerTitle: groupName,
          headerTitleAlign: "center"
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {groupImage ? (
              <Image source={{ uri: groupImage }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>Select Icon</Text>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>
      )}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id} // Ensure this matches your device structure
        renderItem={({ item }) => (
          <DeviceItem
            device={item}
            isSelected={selectedDevices.has(item.id)}
            onSelect={() => handleDeviceSelect(item.id)}
          />
        )}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        style={styles.deviceList}
        contentContainerStyle={devices.length === 0 ? styles.emptyList : undefined}
      />

      <PaperButton mode="contained" onPress={handleAddDevices} style={styles.addButton}>
        Add Selected Devices
      </PaperButton>
      
      <PaperButton mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save Group
      </PaperButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  imagePicker: {
    width: 50,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: "#aaa",
  },
  deviceList: {
    paddingHorizontal: 20,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  selectedDevice: {
    backgroundColor: "#e0f7fa",
  },
  deviceName: {
    fontSize: 16,
  },
  addButton: {
    margin: 20,
  },
  saveButton: {
    margin: 20,
  },
  emptyList: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DetailGroupScreen;
