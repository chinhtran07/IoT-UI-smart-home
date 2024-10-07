import { Stack } from "expo-router";

export default function ScenesLayout() {
    return (
        <Stack initialRouteName="addScene">
            <Stack.Screen name="addScene" options={{ headerShown: false }} />
            <Stack.Screen name="[sceneId]" options={{ headerShown: false }} />
        </Stack>
    );
}
