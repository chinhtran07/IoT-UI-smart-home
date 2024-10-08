import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";

interface Device {
  id: string;
  name: string;
  permissions: {
    read: boolean;
    write: boolean;
    all: boolean;
  };
}

const PermissionScreen: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDevices = async () => {
      const res = await apiClient.get(API_ENDPOINTS.devices.by_owner);
      if (res.status === 200) {
        setDevices(res.data); // Giả định rằng dữ liệu trả về có cấu trúc tương ứng
      }
    };

    fetchDevices();
  }, []);

  const togglePermission = async (id: string, permission: keyof Device["permissions"]) => {
    const device = devices.find((d) => d.id === id);
    if (device) {
      const newStatus = !device.permissions[permission];

      // Cập nhật trạng thái quyền sử dụng thiết bị trong cơ sở dữ liệu
      await apiClient.put(`${API_ENDPOINTS.access_control.grant}/${id}`, {
        [permission]: newStatus,
      });

      setDevices((prevDevices) =>
        prevDevices.map((d) =>
          d.id === id ? { ...d, permissions: { ...d.permissions, [permission]: newStatus } } : d
        )
      );
    }
  };

  const renderItem = ({ item }: { item: Device }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.permissionsContainer}>
        <TouchableOpacity onPress={() => togglePermission(item.id, 'read')}>
          <Text style={[styles.permissionText, item.permissions.read && styles.activePermission]}>Read</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => togglePermission(item.id, 'write')}>
          <Text style={[styles.permissionText, item.permissions.write && styles.activePermission]}>Write</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => togglePermission(item.id, 'all')}>
          <Text style={[styles.permissionText, item.permissions.all && styles.activePermission]}>All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No devices available</Text>}
      />
      <Button title="Add Device" onPress={() => router.push("/(devices)/addDevice")} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 10,
  },
  permissionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  permissionText: {
    fontSize: 14,
    color: "#007BFF",
  },
  activePermission: {
    fontWeight: "bold",
    color: "#0056b3",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
});

export default PermissionScreen;
