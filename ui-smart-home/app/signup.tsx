import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_ENDPOINTS } from "@/configs/apiConfig";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    const { username, password, firstName, lastName, email, phone } = formData;

    if (!username || !password || !firstName || !lastName || !email || !phone) {
      return Alert.alert("Validation Error", "All fields are required.");
    }

    setLoading(true);

    try {
      await axios.post(API_ENDPOINTS.auth.register, formData);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/login");
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Username"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="First Name"
        value={formData.firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Last Name"
        value={formData.lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Phone"
        value={formData.phone}
        onChangeText={(text) => handleInputChange("phone", text)}
        keyboardType="phone-pad"
        style={styles.input}
        mode="outlined"
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button mode="contained" onPress={handleSignup} style={styles.button}>
          Sign Up
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6200EE",
  },
});
