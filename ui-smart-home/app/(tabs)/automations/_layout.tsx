import { Stack } from "expo-router";

export default function RootLayout() {

    return (
        <Stack
            initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="addAutomation" options={{ headerTitleAlign: "center", headerTitle: "Create Automation"}}/>
            <Stack.Screen name="addScene" options={{ headerTitleAlign: "center", headerTitle: "Create Scene" }}/>
            <Stack.Screen
                name="[automationId]"
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: true,
                }}
            />
            <Stack.Screen
                name="[sceneId]"
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: true,
                }}
            />
        </Stack>
    );
}
