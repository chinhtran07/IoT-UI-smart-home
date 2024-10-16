import { Stack } from "expo-router";

export default function SceneLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="addScene" options={{ headerShown: false }} />
      <Stack.Screen name="[sceneId]" options={{ headerShown: false }} />

    </Stack>
  );
}
