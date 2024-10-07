import { Stack } from "expo-router";

export default function ScenariosLayout() {
    return (
        <Stack initialRouteName="addScenario">
            <Stack.Screen name="addScenario" options={{ headerShown: false }} />
            <Stack.Screen name="[scenarioId]" options={{ headerShown: false }} />
        </Stack>
    );
}
