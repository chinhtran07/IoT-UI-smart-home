import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";
import { useLocalSearchParams } from "expo-router";

// Define the structure of each group
interface Group {
  _id: string;
  name: string;
  icon: string;
  devices: any[];
}

const GroupDetailScreen: React.FC = () => {
  const [group, setGroup] = useState<Group | null>(null); // Initialize as null
  const { groupId } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      if (Array.isArray(groupId)) {
        console.error("groupId is an array:", groupId);
        return;
      }
      try {
        const res = await apiClient.get(API_ENDPOINTS.groups.detailed(groupId));
        if (res.status === 200) {
          setGroup(res.data);
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
        setGroup(null); // Set group to null if there's an error
      }
    };

    fetchData(); // Call fetchData here
  }, [groupId]); // Add groupId as a dependency

  // If group is not found, show an error message
  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Group not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: group.icon }} style={styles.groupImage} />
      <Text style={styles.groupName}>{group.name}</Text>
      {/* Add more group details here if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
  },
});

export default GroupDetailScreen;
