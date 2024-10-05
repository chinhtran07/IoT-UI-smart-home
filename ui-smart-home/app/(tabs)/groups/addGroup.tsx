import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Searchbar, Button as PaperButton, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

const availableDevices = [
  { id: '1', name: 'Device 1', description: 'Description for Device 1', image: 'https://example.com/device1.png' },
  { id: '2', name: 'Device 2', description: 'Description for Device 2', image: 'https://example.com/device2.png' },
  { id: '3', name: 'Device 3', description: 'Description for Device 3', image: 'https://example.com/device3.png' },
  { id: '4', name: 'Device 4', description: 'Description for Device 4', image: 'https://example.com/device4.png' },
  { id: '5', name: 'Device 5', description: 'Description for Device 5', image: 'https://example.com/device5.png' },
  { id: '6', name: 'Device 6', description: 'Description for Device 6', image: 'https://example.com/device6.png' },
];

interface Device {
  id: string;
  name: string;
  description: string;
  image: string;
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
      <Image source={{ uri: device.image }} style={styles.deviceImage} />
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceDescription}>{device.description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const AddGroupDeviceScreen: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const ITEMS_PER_PAGE = 2;

  // Load devices function
  const loadDevices = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      const newDevices = availableDevices.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
      if (newDevices.length === 0) {
        setHasMore(false);
      } else {
        setFilteredDevices((prev) => [...prev, ...newDevices]);
        setPage((prev) => prev + 1);
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId) ? prev.filter(id => id !== deviceId) : [...prev, deviceId]
    );
  };

  const handleSave = () => {
    console.log("Group Name:", groupName);
    console.log("Selected Devices:", selectedDevices);
    console.log("Group Image:", groupImage);
    router.back();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    setFilteredDevices([]);
    setPage(0);
    setHasMore(true);
    if (query) {
      const filtered = availableDevices.filter(device =>
        device.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDevices(filtered.slice(0, ITEMS_PER_PAGE));
    } else {
      setFilteredDevices([]);
      loadDevices();
    }
  };

  return (
    <View style={styles.container}>
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
        onChangeText={handleSearchQueryChange}
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
        onEndReached={loadDevices}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        style={styles.deviceList}
        contentContainerStyle={filteredDevices.length === 0 ? styles.emptyList : undefined}
      />

      <PaperButton mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save Group
      </PaperButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20, // Adjust padding to prevent overlapping with the bottom button
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: '#aaa',
    textAlign: 'center',
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
    justifyContent: 'center',
  },
  deviceItem: {
    flex: 1,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontWeight: 'bold',
  },
  deviceDescription: {
    color: '#777',
  },
  selectedDevice: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  }
});

export default AddGroupDeviceScreen;
