import { Stack } from "expo-router";

export default function ScenarioLayout() {
  return (
    <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="addScenario" options={{ headerShown: false }} />
          <Stack.Screen name="[scenarioId]" options={{ headerShown: false }} />
    </Stack>
  );
}
