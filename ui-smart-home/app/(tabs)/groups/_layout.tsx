import { QRProvider } from "@/context/QrContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <QRProvider>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="addGroup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="[groupId]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </QRProvider>
  );
}
