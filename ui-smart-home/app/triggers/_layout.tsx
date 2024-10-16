import { Stack } from "expo-router";

export default function TriggerLayout() {
  return (
    <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="[detail]" options={{ headerShown: false }} />
    </Stack>
  );
}
