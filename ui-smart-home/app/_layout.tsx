import { ActionProvider } from "@/context/ActionContext";
import { QRProvider } from "@/context/QRContext";
import { TriggerProvider } from "@/context/TriggerContext";
import store from "@/store/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <TriggerProvider>
        <ActionProvider>
          <QRProvider>
            <Stack initialRouteName="login">
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="actions" options={{ headerShown: false }} />
              <Stack.Screen name="devices" options={{ headerShown: false }} />
              <Stack.Screen name="scenarios" options={{ headerShown: false }} />
              <Stack.Screen name="scenes" options={{ headerShown: false }} />
              <Stack.Screen name="triggers" options={{ headerShown: false }} />
              <Stack.Screen name="groups" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
            </Stack>
          </QRProvider>
        </ActionProvider>
      </TriggerProvider>
    </Provider>
  );
}
