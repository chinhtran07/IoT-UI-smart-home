import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store'; // Đảm bảo bạn đã tạo Redux store ở đâu đó

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
 

  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ReduxProvider>
  );
}
