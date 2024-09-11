import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Provider as PaperProvider, Provider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Tabs screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0ff',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderRadius: 20,
          position: 'absolute',
          bottom: 20,
          left: 10,
          right: 10,

        }
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
            headerShown: false, // Ẩn header
          }}
        />

        <Tabs.Screen
          name="devices/index"
          options={{
            title: 'Accessories',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu-outline" color={color} size={size} />
            ),
            headerShown: false, // Ẩn header
          }}
        />

        {/* Tab Automation */}
        <Tabs.Screen
          name="automation/index"
          options={{
            title: 'Automation',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cog-outline" color={color} size={size} />
            ),
            headerShown: false, // Ẩn header
          }}
        />

        <Tabs.Screen
          name="profile/index"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
