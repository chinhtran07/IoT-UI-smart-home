import { QRProvider } from "@/context/QrContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <QRProvider>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" />
        <Stack.Screen
          name="addGroup"
        />
        <Stack.Screen
          name="[groupId]"
        />
      </Stack>
    </QRProvider>
  );
}
