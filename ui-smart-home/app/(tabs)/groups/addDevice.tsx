import { Link, Stack } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCameraPermissions } from "expo-camera";

export default function AddDeviceScreen() {

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = permission?.granted;

  return (
    <SafeAreaView style={[styles.container]}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      
      {/* Tiêu đề */}
      <Text style={styles.title}>QR Code Scanner</Text>
      
      {/* Nút yêu cầu quyền truy cập camera */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.requestButton} onPress={requestPermission}>
          <Text style={styles.requestButtonText}>Request Camera Permission</Text>
        </Pressable>
        
        {/* Nút quét mã QR */}
        <Link href={"/(tabs)/groups/scanner"} asChild>
          <Pressable 
            style={[styles.scanButton, { opacity: isPermissionGranted ? 1 : 0.5 }]} 
            disabled={!isPermissionGranted}>
            <Text style={styles.scanButtonText}>Scan QR Code</Text>
          </Pressable>
        </Link>
      </View>
      
      {/* Lưu ý hiển thị khi chưa có quyền */}
      {!isPermissionGranted && (
        <Text style={styles.permissionWarning}>Permission is required to scan QR codes.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: "center",
    gap: 20,
  },
  requestButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});
