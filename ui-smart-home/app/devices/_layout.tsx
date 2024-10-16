import { Stack } from "expo-router";

export default function DeviceLayout() {
  return (
    <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="addDevice" options={{ headerShown: false }} />
          <Stack.Screen name="[deviceId]" options={{ headerShown: false }} />
          <Stack.Screen name="scanner" options={{ headerShown: false }} />
    </Stack>
  );
}
