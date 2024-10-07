import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="detail" options={{ headerShown: false }} />
            <Stack.Screen name="permission" options={{ headerShown: false }} />
            <Stack.Screen name="setting" options={{ headerShown: false }} />
        </Stack>
    );
}
