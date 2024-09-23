import { Alert, Platform } from "react-native";
import WifiManager from "react-native-wifi-reborn";

const wifiService = {
  // Scan for available WiFi networks
  scanNetworks: async () => {
    try {
      if (Platform.OS === "android") {
        const availableNetworks = await WifiManager.loadWifiList();
        return availableNetworks; // Returns the list of available networks
      } else if (Platform.OS === "ios") {
        Alert.alert("Not supported", "Scanning WiFi networks is not supported on iOS.");
        return [];
      } else {
        Alert.alert("Not supported", "Scanning WiFi networks is not supported on this platform.");
        return [];
      }
    } catch (error) {
      console.error("Error scanning WiFi networks:", error);
      Alert.alert("Error", "Failed to scan WiFi networks.");
      return [];
    }
  },

  // Connect to a WiFi network using SSID and password
  connectToWifi: async (ssid: string, password: string) => {
    try {
      if (Platform.OS === "android") {
        await WifiManager.connectToProtectedSSID(ssid, password, false, false);
        Alert.alert("Success", `Connected to ${ssid}`);
      } else if (Platform.OS === "ios") {
        Alert.alert("Not supported", "Connecting to WiFi via app is not supported on iOS.");
      } else {
        Alert.alert("Not supported", "Connecting to WiFi is not supported on this platform.");
      }
    } catch (error) {
      console.error("Error connecting to WiFi:", error);
      Alert.alert("Error", "Failed to connect to the WiFi network.");
    }
  },

  // Disconnect from the current WiFi network
  disconnectWifi: async () => {
    try {
      if (Platform.OS === "android") {
        await WifiManager.disconnect();
        Alert.alert("Success", "Disconnected from WiFi.");
      } else if (Platform.OS === "ios") {
        Alert.alert("Info", "Disconnecting from WiFi is not supported on iOS.");
      }
    } catch (error) {
      console.error("Error disconnecting WiFi:", error);
      Alert.alert("Error", "Failed to disconnect from WiFi.");
    }
  },
};

export default wifiService;
