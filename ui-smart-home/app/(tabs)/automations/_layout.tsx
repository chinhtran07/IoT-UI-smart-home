import { Stack } from "expo-router";

export default function RootLayout() {

    return (
        <Stack
            initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="addAutomation"
                options={{
                    headerTitleAlign: "center",
                    headerTitle: "Create Automation",
                    headerBackVisible: true
                }} />
        </Stack>
    );
}
