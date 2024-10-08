import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "expo-router"; // Import useRouter

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter(); // Initialize the router

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: async () => {
          await logout();
          console.log("User logged out");
          router.push("/login"); // Navigate to the login screen
        }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user?.avatar || "https://via.placeholder.com/100" }} style={styles.profileImage} />
        <Text style={styles.profileName}>{user?.username || "John Doe"}</Text>
        <Text style={styles.profileEmail}>{user?.email || "john.doe@example.com"}</Text>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create" size={20} color="#fff" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(tabs)/profile/permission")}>
          <Text style={styles.menuItemText}>Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 30,
  },
  editButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  menu: {
    width: "100%",
  },
  menuItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default ProfileScreen;
