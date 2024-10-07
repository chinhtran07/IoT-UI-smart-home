import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Stack } from "expo-router";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";

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
  const router = useRouter(); // Initialize router

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
      <Stack.Screen
        options={{
          headerTitle: group.name,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.headerBackground.color,
          },
          headerTintColor: "#fff",
          headerBackTitleVisible: false, // Hide the back title
        }}
      />

      <Image source={{ uri: group.icon }} style={styles.groupImage} />
      <Text style={styles.groupName}>{group.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center", // Center the image
    marginTop: 20, // Add margin top for spacing
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Center the text
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
  },
});

export default GroupDetailScreen;
