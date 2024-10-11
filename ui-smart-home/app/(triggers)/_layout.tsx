import { Stack } from "expo-router";

export default function TriggerLayout() {


    return (
        <Stack initialRouteName="listTriggers">
            <Stack.Screen name="listTriggers" options={{ headerShown: false }} />
            <Stack.Screen name="trigger" options={{headerShown: false}} />
        </Stack>
    );
}
