import { QRProvider } from "@/context/QrContext";
import { Stack } from "expo-router";

export default function RootLayout() {


  return (
    <QRProvider>
    <Stack
    >
      <Stack.Screen name="addDevice" options={{ headerTitleAlign: "center", headerTitle: "Add Device", headerBackVisible: true }} />
      <Stack.Screen name="scanner" options={{ headerShown: false }} />
      <Stack.Screen
        name="[deviceId]"
        options={{
          headerShown: true,
          headerTitle: '',
          headerTitleAlign: 'center', 
          headerBackTitleVisible: true,
        }}
        />
      </Stack>
      </QRProvider>
  );
}
