import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator, TouchableOpacity, Platform, Appearance } from "react-native"; // Import Appearance
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, Stack, useFocusEffect, useRouter } from "expo-router";
import apiClient from "@/services/apiService";
import { API_ENDPOINTS } from "@/configs/apiConfig";
import { IconButton } from "react-native-paper"; 
import { Colors } from "@/constants/Colors"; 

const optionsData = ["Scenario", "Scene"];

const colorScheme = Appearance.getColorScheme(); // "light" | "dark"

const Item = React.memo(({ item, onPress }: { item: { id: string; name: string }; onPress: (id: string) => void }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={() => onPress(item.id)}>
    <Text style={styles.itemTitle}>{item.name}</Text>
  </TouchableOpacity>
));

export default function Index() {
  const [selectedOption, setSelectedOption] = useState(optionsData[0]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ scenarios: Array<any>; scenes: Array<any>; error?: string }>({ scenarios: [], scenes: [] });
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resScenario, resScene] = await Promise.all([
        apiClient.get(API_ENDPOINTS.scenarios.by_owner),
        apiClient.get(API_ENDPOINTS.scenes.by_owner),
      ]);

      setData({
        scenarios: resScenario.status === 200 ? resScenario.data : [],
        scenes: resScene.status === 200 ? resScene.data : [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData((prev) => ({ ...prev, error: "Failed to load data." }));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const currentData = selectedOption === "Scenario" ? data.scenarios : data.scenes;

  const handleAddPress = () => {
    const route = selectedOption === "Scenario" ? "/scenarios/addScenario" : "/scenes/addScene";
    router.push(route);
  };

  const handleItemPress = (itemId: string) => {
    const route = selectedOption === "Scenario" ? `/scenarios/${itemId}` : `/scenes/${itemId}`;
    router.push(route as Href);
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  // Xác định chế độ hiện tại

  return (
    <View style={[styles.container]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.header.color
          },
          headerLeft: () => (
            <View style={styles.headerOptions}>
              {optionsData.map((option) => (
                <TouchableOpacity key={option} onPress={() => handleSelectOption(option)}>
                  <Text style={[styles.headerOptionText, selectedOption === option && styles.selectedOption]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ),
          headerRight: () => (
            <IconButton
              icon="plus"
              size={28}
              iconColor={Colors.dark.icon}
              onPress={handleAddPress}
              style={styles.headerButton} 
            />
          ),
        }}
      />
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : currentData.length > 0 ? (
          <FlatList
            data={currentData}
            renderItem={({ item }) => <Item item={item} onPress={handleItemPress} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items available</Text>
            <Button title={`Add ${selectedOption}`} onPress={handleAddPress} color="#007BFF" />
          </View>
        )}
        {data.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{data.error}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 1,
    borderColor: "#e0e0e0",
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
    color: "dark",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  headerButton: {
    marginHorizontal: 10,
  },
  headerOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerOptionText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: colorScheme === "light" ? Colors.light.text : Colors.dark.text, 
  },
  selectedOption: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
