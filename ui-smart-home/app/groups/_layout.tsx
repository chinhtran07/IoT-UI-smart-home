import { Stack } from "expo-router";

export default function GroupLayout() {
  return (
    <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="addGroup" options={{ headerShown: false }} />
          <Stack.Screen name="[groupId]" options={{ headerShown: false }} />
    </Stack>
  );
}
