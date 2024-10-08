import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReusableHeader from "@/components/Header"; // Ensure this is your reusable header component
import { Stack, useRouter } from "expo-router";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";

const optionsData = ["Scenario", "Scene"];

export default function Index() {
  const [selectedOption, setSelectedOption] = useState(optionsData[0]);
  const [scenarios, setScenarios] = useState([]); // Fetched scenarios
  const [scenes, setScenes] = useState([]); // Fetched scenes
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const resScenario = await apiClient.get(API_ENDPOINTS.scenarios.by_owner);
        if (resScenario.status === 200) {
          setScenarios(resScenario.data);
        }

        const resScene = await apiClient.get(API_ENDPOINTS.scenes.by_user);
        if (resScene.status === 200) {
          setScenes(resScene.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on mount

  const handleLeftMenuSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  const goToAddScenario = () => {
    router.push("/(scenarios)/addScenario");
  };

  const goToAddScene = () => {
    router.push("/(scenes)/addScene");
  };

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

  const currentData = selectedOption === "Scenario" ? scenarios : scenes;

  return (
    <SafeAreaView style={styles.container}>
      <ReusableHeader
        title={selectedOption}
        leftMenuOptions={optionsData}
        onLeftMenuSelect={handleLeftMenuSelect}
        menuItems={menuItems}
      />
      <View style={styles.contentContainer}>
        {loading ? ( // Display loading indicator while fetching data
          <ActivityIndicator size="large" color="#007BFF" />
        ) : currentData.length > 0 ? (
          <FlatList
            data={currentData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
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
    paddingTop: 20, // Add spacing at the top
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
