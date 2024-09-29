import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store'; // Đảm bảo bạn đã tạo Redux store ở đâu đó

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
 

  return (
      <Stack
          initialRouteName="index"
      >
          <Stack.Screen name="addDevice" options={{ headerShown: false }} />
          <Stack.Screen name="addGroup" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="scanner" options={{ headerShown: false }} />
          <Stack.Screen name="[groupId]" />
        </Stack>
  );
}
