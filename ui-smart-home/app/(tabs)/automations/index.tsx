import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReusableHeader from "@/components/Header"; // Ensure this is your reusable header component
import { Stack, useRouter } from "expo-router";

const optionsData = ["Scenario", "Scene"];

const mockAutomations = [
  { id: '1', title: "Automation 1", description: "Description for Automation 1" },
  { id: '2', title: "Automation 2", description: "Description for Automation 2" },
  { id: '3', title: "Automation 3", description: "Description for Automation 3" },
];

const mockScenes = [
  { id: '1', title: "Scene 1", description: "Description for Scene 1" },
  { id: '2', title: "Scene 2", description: "Description for Scene 2" },
  { id: '3', title: "Scene 3", description: "Description for Scene 3" },
];

export default function Index() {
  const [selectedOption, setSelectedOption] = useState(optionsData[0]);
  const router = useRouter();

  const handleLeftMenuSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  const goToAddScenario = () => {
    router.push("/(scenarios)/addScenario");
  }

  const goToAddScene = () => {
    router.push("/(scenes)/addScene");
  }

  const menuItems = [
    { label: "Add Scenario", onPress: goToAddScenario },
    { label: "Add Scene", onPress: goToAddScene },
  ];

  const renderItem = ({ item }: { item: { id: string; title: string; description: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  const currentData = selectedOption === "Scenario" ? mockAutomations : mockScenes;

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
              onPress={() => selectedOption === "Scenario" ? goToAddScenario() : goToAddScene()}
              color="#007BFF"
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
    paddingTop: 20, // Thêm khoảng cách ở trên cùng
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  listContainer: {
    paddingVertical: 10,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#343a40",
  },
  itemDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 20,
  },
});
