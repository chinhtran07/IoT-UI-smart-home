import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, Stack } from "expo-router";
import { Searchbar, Button as PaperButton, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";

interface Device {
  id: string;
  name: string;
  status: string;
  type: string;
}

interface ResponseData {
  currentPage: number;
  devices: Device[];
  total: number;
  totalPages: number;
}

interface DeviceItemProps {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ device, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[styles.deviceItem, isSelected && styles.selectedDevice]}
    onPress={onSelect}
  >
    <View style={styles.deviceContent}>
      <Text style={styles.deviceName}>{device.name}</Text>
    </View>
  </TouchableOpacity>
);

const AddGroupDeviceScreen: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  const fetchDevices = useCallback(
    async (pageNum: number) => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const res = await apiClient.get<ResponseData>(
          `${API_ENDPOINTS.devices.by_owner}?page=${pageNum}`
        );
        if (res.status === 200) {
          const { devices: newDevices, totalPages } = res.data;
          setDevices((prevDevices) => [...prevDevices, ...newDevices]);
          setHasMore(pageNum < totalPages);
        } else {
          console.error("Failed to fetch devices");
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchDevices(page);
  }, [page, fetchDevices]);

  useEffect(() => {
    setFilteredDevices(
      searchQuery
        ? devices.filter((device) =>
          device.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : devices
    );
  }, [searchQuery, devices]);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSave = async () => {
    if (!groupName) {
      alert("Please enter a group name.");
      return;
    }

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

      const createGroupResponse = await apiClient.post(
        API_ENDPOINTS.groups.create,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (createGroupResponse.status === 201) {
        const groupId = createGroupResponse.data.id;

        await apiClient.post(API_ENDPOINTS.groups.add_device(groupId), {
          deviceIds: selectedDevices,
        });

        alert("Group created and devices added successfully!");
        navigation.goBack();
      } else {
        alert("Failed to create group.");
      }
    } catch (error) {
      console.error("Error adding group and devices:", error);
      alert("An error occurred while saving the group.");
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Add Group",
          headerTitleAlign: "center", 
          headerStyle: {
            backgroundColor: "#94D9F1",
          },
          headerTintColor: "white",
        }}
      />


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

      <Searchbar
        placeholder="Search devices..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeviceItem
            device={item}
            isSelected={selectedDevices.includes(item.id)}
            onSelect={() => handleDeviceSelect(item.id)}
          />
        )}
        onEndReached={() => setPage((prev) => prev + 1)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
        style={styles.deviceList}
        contentContainerStyle={filteredDevices.length === 0 ? styles.emptyList : undefined}
      />

      <PaperButton mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save Group
      </PaperButton>
    </SafeAreaView>
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
    textAlign: "center",
  },
  searchBar: {
    marginBottom: 15,
    marginHorizontal: 20,
  },
  deviceList: {
    flex: 1,
    marginHorizontal: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  deviceItem: {
    flex: 1,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  deviceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceName: {
    fontSize: 16,
  },
  selectedDevice: {
    backgroundColor: "#e0f7fa",
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
});

export default AddGroupDeviceScreen;
