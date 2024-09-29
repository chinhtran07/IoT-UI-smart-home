import { Stack, useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for back button icon

export default function AddDeviceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = permission?.granted;
  const router = useRouter();

  // Combined function to handle permission request and navigation
  const handleScanPress = async () => {
    if (!isPermissionGranted) {
      const { status } = await requestPermission();
      if (status === 'granted') {
        router.push("/(tabs)/groups/scanner"); // Navigate to scanner if permission is granted
      } else {
        alert("Camera permission is required to scan QR codes.");
      }
    } else {
      router.push("/(tabs)/groups/scanner"); // Navigate to scanner if permission is already granted
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "QR Code Scanner",
          headerTitleAlign: 'center', // Center the title
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <AntDesign name="left" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      
      {/* Tutorial or instructions section */}
      <View style={styles.tutorialContainer}>
        <Text style={styles.tutorialText}>
          To scan a QR code, please allow camera access. Press the button below once you've granted permission.
        </Text>
      </View>
      
      {/* Button to request camera permission and navigate to scanner */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.scanButton} onPress={handleScanPress}>
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </Pressable>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "space-between", // Distribute space between tutorial and button
  },
  tutorialContainer: {
    flex: 1, // Make this section flexible to take available space
    justifyContent: "center", // Center the text in the available space
  },
  tutorialText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20, // Give some margin from the bottom
  },
  scanButton: {
    backgroundColor: "#03dac6",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  permissionWarning: {
    color: "#ff0000",
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
  },
  backButton: {
    marginLeft: 15,
  },
});
