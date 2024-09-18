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


        setTimeout(async () => {
          if (token && !expired) {
            router.replace("/(tabs)"); 
          } else {
            router.replace("/login"); 
          }


          await SplashScreen.hideAsync();
        }, 1000);
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
