import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReusableHeader from "@/components/Header"; // Ensure this is your reusable header component
import { useRouter } from "expo-router";

const optionsData = ["Automation", "Scene"];

// Mock data for Automations
const mockAutomations = [
  { id: '1', title: "Automation 1", description: "Description for Automation 1" },
  { id: '2', title: "Automation 2", description: "Description for Automation 2" },
  { id: '3', title: "Automation 3", description: "Description for Automation 3" },
];

// Mock data for Scenes
const mockScenes = [
  { id: '1', title: "Scene 1", description: "Description for Scene 1" },
  { id: '2', title: "Scene 2", description: "Description for Scene 2" },
  { id: '3', title: "Scene 3", description: "Description for Scene 3" },
];

export default function Index() {
  const [selectedOption, setSelectedOption] = useState(optionsData[0]); // Default to the first option
  const router = useRouter(); 

  // Handler for left menu selection
  const handleLeftMenuSelect = (option: string) => {
    setSelectedOption(option); // Update the selected option
    console.log(`Selected option: ${option}`);
  };

  const goToAddAutomation = () => {
    router.push("/(tabs)/automations/addAutomation");
  }

  const goToAddScene = () => {
    router.push("/(tabs)/scenes/addScene");
  }

  // Menu items for the reusable header
  const menuItems = [
    { label: "Add Automation", onPress: () =>  router.push("/(tabs)/automations/addAutomation") }, 
    { label: "Add Scene", onPress: () =>     router.push("/(tabs)/scenes/addScene")    }, 
  ];

  // Render mock data
  const renderItem = ({ item }: { item: { id: string; title: string; description: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  // Determine the current data based on selected option
  const currentData = selectedOption === "Automation" ? mockAutomations : mockScenes;

  return (
    <SafeAreaView style={styles.container}>
      <ReusableHeader
        title={selectedOption}
        leftMenuOptions={optionsData}
        onLeftMenuSelect={handleLeftMenuSelect}
        menuItems={menuItems}
      />
      <View style={styles.contentContainer}>
        {currentData.length > 0 ? (
          <FlatList
            data={currentData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items available</Text>
            <Button
              title={`Add ${selectedOption}`}
                onPress={() => selectedOption === "Automation" ? goToAddAutomation() : goToAddScene()}
              color="#007BFF" // Primary color
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa", // Light background color for better contrast
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  listContainer: {
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: "#ffffff", // White background for cards
    padding: 20,
    borderRadius: 12, // Rounded corners
    shadowColor: "#000", // Shadow properties
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2, // Elevation for Android
    marginVertical: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600', // Medium weight for modern look
    color: "#343a40", // Dark text color
  },
  itemDescription: {
    fontSize: 14,
    color: "#6c757d", // Lighter color for description
    marginTop: 4, // Space above description
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#6c757d", // Gray color for empty state text
    marginBottom: 20,
  },
});
