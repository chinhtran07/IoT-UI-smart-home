import React, { useEffect, useState, useRef } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Dialog, Portal, Button, TextInput, Provider as PaperProvider, List, Text } from "react-native-paper";
import wifiService from "@/services/wifiService";
import { Camera, CameraView, BarcodeBounds } from 'expo-camera'; 
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

export default function AddDeviceScreen() {
  const [networks, setNetworks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [wifiPassword, setWifiPassword] = useState<string>("");
  const [selectedSSID, setSelectedSSID] = useState<string>("");
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const cameraRef = useRef<any>(null); // Sử dụng useRef để giữ tham chiếu tới camera

  const router = useRouter();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');

      if (status === 'granted') {
        scanWifi();
      }
    };

    requestPermissions();
  }, []);

  const scanWifi = async () => {
    setLoading(true);
    try {
      const wifiList = await wifiService.scanNetworks();
      setNetworks(wifiList);
    } catch (error) {
      console.error("Failed to scan WiFi networks.");
    }
    setLoading(false);
  };

  const handleConnect = (ssid: string) => {
    setSelectedSSID(ssid);
    setDialogVisible(true);
  };

  const connectToNetwork = async () => {
    if (wifiPassword) {
      setDialogVisible(false);
      await wifiService.connectToWifi(selectedSSID, wifiPassword);
    } else {
      console.error("Password cannot be empty");
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    const [ssid, password] = data.split(';');
    if (ssid && password) {
      setSelectedSSID(ssid);
      setWifiPassword(password);
      setDialogVisible(true);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleConnect(item.SSID)} style={styles.networkItem}>
      <List.Item
        title={item.SSID}
        left={() => <List.Icon icon="wifi" />}
        description="Tap to connect"
      />
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* Custom Header, only shown when not scanning */}
        {!scanning && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#6200ee" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Device</Text>
            <TouchableOpacity onPress={() => setScanning(true)} style={styles.scanButton}>
              <Ionicons name="scan-sharp" size={24} color="#6200ee" />
            </TouchableOpacity>
          </View>
        )}

        {scanning ? (
          hasCameraPermission ? (
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                autofocus="on"
                style={StyleSheet.absoluteFill}
              />
              {/* Khung nhận diện QR */}
              <View style={styles.qrFrame} />
              <TouchableOpacity style={styles.backButtonCamera} onPress={() => setScanning(false)}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.errorText}>Camera permission is not granted</Text>
          )
        ) : (
          <>
            <Text style={styles.title}>Available WiFi Networks</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#6200ee" />
            ) : (
              <FlatList
                data={networks}
                renderItem={renderItem}
                keyExtractor={(item) => item.BSSID}
                ListEmptyComponent={<Text style={styles.emptyText}>No WiFi networks found.</Text>}
              />
            )}

            <Portal>
              <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Title>Enter WiFi Password</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    label="Password"
                    value={wifiPassword}
                    onChangeText={(text) => setWifiPassword(text)}
                    secureTextEntry
                    mode="outlined"
                    style={styles.textInput}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setDialogVisible(false)} mode="text">Cancel</Button>
                  <Button mode="contained" onPress={connectToNetwork}>Connect</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  backButton: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200ee",
    flex: 1,
    textAlign: "center",
  },
  scanButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#6200ee",
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  qrFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: '40%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Màu nền khung
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonCamera: {
    position: 'absolute',
    top: 40,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  networkItem: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    padding: 15,
    elevation: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: "#ff0000",
    marginTop: 20,
  },
  textInput: {
    marginTop: 10,
  },
});
