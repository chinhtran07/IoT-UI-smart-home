import React, { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import {
  getAuthToken,
  isTokenExpired,
} from "@/services/authService"; // Import the new authService functions

SplashScreen.preventAutoHideAsync(); // Prevent auto-hide until ready

export default function SplashScreenComponent() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        const expired = await isTokenExpired();

        console.log(`Token: ${token}, Expired: ${expired}`);

        setTimeout(async () => {
          if (token && !expired) {
            router.replace("/(tabs)"); // Redirect to the main app if the token is valid
          } else {
            router.replace("/login"); // Redirect to login if the token is invalid or expired
          }

          // Hide splash screen after navigating
          await SplashScreen.hideAsync();
        }, 1000); // Adjust the delay as needed
      } catch (error) {
        console.error("Error checking authentication:", error);
        await SplashScreen.hideAsync(); // Ensure splash screen is hidden even if there's an error
      }
    };

    checkAuth();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Set a background color
    justifyContent: "center",
    alignItems: "center",
  },
});
