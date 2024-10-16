import { Stack, useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for back button icon
import { useQR } from "@/context/QRContext";
import { useEffect } from "react";
import axios from "axios";

export default function AddDeviceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = permission?.granted;
  const router = useRouter();
  const { qrData } = useQR();

  useEffect(() => {
    const sendWifi = async () => {
      if (qrData) {
        try {
          const res = await axios.post(qrData, JSON.stringify({
            ssid: "NT QUANG HANH B",
            password: "79797979"
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Response:', res.data);
        } catch (error) {
          console.error('Error sending Wi-Fi data:', error);
        }
      }
    };

    sendWifi(); 
  }, [qrData]);

  const handleScanPress = async () => {
    if (!isPermissionGranted) {
      const { status } = await requestPermission();
      if (status === 'granted') {
        router.push("/devices/scanner"); // Navigate to scanner if permission is granted
      } else {
        alert("Camera permission is required to scan QR codes.");
      }
    } else {
      router.push("/devices/scanner"); // Navigate to scanner if permission is already granted
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
          Bước 1: Kết nối Access Point của thiết bị
        </Text>
        <Text style={styles.tutorialText}>
          Bước 2: Truy cập vào ứng dụng
        </Text>
        <Text style={styles.tutorialText}>
          Bước 3: Quét mã để thêm ứng dụng
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
    marginBottom: 10, // Reduced margin for better spacing
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
  backButton: {
    marginLeft: 15,
  },
});
