import { Stack } from "expo-router";

export default function ActionLayout() {

    return (
        <Stack initialRouteName="listActions">
            <Stack.Screen name="listActions" options={{ headerShown: false }} />
            <Stack.Screen name="[detailId]" options={{headerShown: false}} />
        </Stack>
    );
}
