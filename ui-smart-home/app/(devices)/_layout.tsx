import { QRProvider } from "@/context/QrContext";
import { Stack } from "expo-router";

export default function DeviceLayout() {


  return (
    <QRProvider>
      <Stack initialRouteName="addDevice">
        <Stack.Screen name="addDevice" options={{ headerShown: false }} />
        <Stack.Screen name="scanner" options={{ headerShown: false }} />
        <Stack.Screen
          name="[deviceId]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </QRProvider>
  );
}
