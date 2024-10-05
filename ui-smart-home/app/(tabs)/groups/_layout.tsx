import { Stack } from "expo-router";

export default function RootLayout() {


  return (
    <Stack
      initialRouteName="index"
    >
      <Stack.Screen name="addDevice" options={{ headerShown: false }} />
      <Stack.Screen name="addGroup" options={{ headerTitleAlign: "center", headerTitle: "Create Group" }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="scanner" options={{ headerShown: false }} />
      <Stack.Screen
        name="[groupId]"
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
