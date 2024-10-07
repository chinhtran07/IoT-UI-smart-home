import { Stack } from "expo-router";

export default function ActionLayout() {

    return (
        <Stack initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
