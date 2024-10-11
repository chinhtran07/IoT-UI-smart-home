import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReusableHeader from "@/components/Header";
import { useFocusEffect, useRouter } from "expo-router";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";

const optionsData = ["Scenario", "Scene"];

export default function Index() {
  const [selectedOption, setSelectedOption] = useState(optionsData[0]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ scenarios: [], scenes: [] });
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resScenario, resScene] = await Promise.all([
        apiClient.get(API_ENDPOINTS.scenarios.by_owner),
        apiClient.get(API_ENDPOINTS.scenes.by_owner),
      ]);

      if (resScenario.status === 200) {
        setData((prev) => ({ ...prev, scenarios: resScenario.data }));
      }

      if (resScene.status === 200) {
        setData((prev) => ({ ...prev, scenes: resScene.data }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleLeftMenuSelect = useCallback((option: string) => {
    setSelectedOption(option);
  }, []);

  const navigateToAdd = useCallback(() => {
    router.push(selectedOption === "Scenario" ? "/(scenarios)/addScenario" : "/(scenes)/addScene");
  }, [selectedOption, router]);

  const navigateToDetail = useCallback((itemId: string) => {
    router.push(selectedOption === "Scenario" ? `/(scenarios)/${itemId}` : `/(scenes)/${itemId}`);
  }, [selectedOption, router]);

  const renderItem = useCallback(
    ({ item }: { item: { id: string; name: string; description: string } }) => (
      <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToDetail(item.id)}>
        <Text style={styles.itemTitle}>{item.name}</Text>
      </TouchableOpacity>
    ),
    [navigateToDetail]
  );

  const currentData = selectedOption === "Scenario" ? data.scenarios : data.scenes;

  return (
    <View style={styles.container}>
      <ReusableHeader
        title={selectedOption}
        leftMenuOptions={optionsData}
        onLeftMenuSelect={handleLeftMenuSelect}
        menuItems={[{ label: `Add ${selectedOption}`, onPress: navigateToAdd }]}
      />
      <View style={styles.contentContainer}>
        {loading ? (
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
            <Button title={`Add ${selectedOption}`} onPress={navigateToAdd} color="#007BFF" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#343a40",
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
