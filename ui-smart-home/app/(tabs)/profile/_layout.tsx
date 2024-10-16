import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="detail" options={{headerShown: false}}/>
      <Stack.Screen name="permission" options={{headerShown: false}}/>
      <Stack.Screen name="subUserManagement" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{headerShown: false}}/>
    </Stack>
  );
}
