import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native"; // Import useRoute

// Define the shape of your route parameters
type RouteParams = {
  groupId: string; // groupId should be a string
};

// Define the structure of each group
interface Group {
  name: string;
  description: string;
  image: string;
}

// Define the structure of groupData with an index signature
type GroupData = {
  [key: string]: Group; // This allows for dynamic keys
};

// Dummy data for demonstration
const groupData: GroupData = {
  "1": {
    name: "Group 1",
    description: "Description for group 1",
    image: "https://via.placeholder.com/100",
  },
  "2": {
    name: "Group 2",
    description: "Description for group 2",
    image: "https://via.placeholder.com/100",
  },
  "3": {
    name: "Group 3",
    description: "Description for group 3",
    image: "https://via.placeholder.com/100",
  },
  "4": {
    name: "Group 4",
    description: "Description for group 4",
    image: "https://via.placeholder.com/100",
  },
};

const GroupDetailScreen: React.FC = () => {
  const route = useRoute();
  const { groupId } = route.params as RouteParams; // Cast route.params to RouteParams

  // Retrieve group data based on groupId
  const group = groupData[groupId];

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
      <Image source={{ uri: group.image }} style={styles.groupImage} />
      <Text style={styles.groupName}>{group.name}</Text>
      <Text style={styles.groupDescription}>{group.description}</Text>
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
  groupDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
  },
});

export default GroupDetailScreen;
