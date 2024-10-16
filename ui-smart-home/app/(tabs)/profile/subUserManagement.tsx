import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { Searchbar } from "react-native-paper";

// Sample user data
const users = [
  { id: "1", name: "Alice Smith" },
  { id: "2", name: "Bob Johnson" },
  { id: "3", name: "Charlie Brown" },
  { id: "4", name: "David Wilson" },
  { id: "5", name: "Eve Davis" },
];

export default function SubUserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: Colors.header.color,
          },
          headerTitle: "",
          headerBackTitleVisible: false,
          headerRight: () => {
            return (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle-sharp" size={25} color={Colors.dark.icon} />
              </TouchableOpacity>
            );
          },
        }}
      />
      
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
      />

      {/* Modal for Search Bar */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Searchbar
              placeholder="Search Users..."
              onChangeText={handleSearch}
              value={searchQuery}
              style={styles.searchBarContainer}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  searchBarContainer: {
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  userName: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
});
