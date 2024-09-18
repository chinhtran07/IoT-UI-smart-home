import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import TabBarIcon from "@/components/navigation/TabBarIcon";

const TabLayout = () => {
  const pathName = usePathname();
  const [isIndexScreen, SetIsIndexScreen] = useState(true);
  useEffect(() => {
    SetIsIndexScreen(pathName === "/");
  }, [pathName]);
  return (
    <View style={[styles.container, {backgroundColor: isIndexScreen ? '#354F63' : "#fff"}]}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#49708F',
            paddingHorizontal: 10,
            marginHorizontal: 20,
            borderRadius: 20,
            overflow: 'hidden',
            borderTopWidth: 0,
            marginBottom: 10,
            paddingBottom: 20
          },
          tabBarLabelStyle: {
            fontSize: 12,
            textAlign: "center"
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#d0d0d0'
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="home-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="groups/index"
          options={{
            tabBarLabel: "Groups",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="grid-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="automations/index"
          options={{
            tabBarLabel: "Automations",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="settings-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="person-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="groups/addDevice"
          options={{href: null, headerShown: false}}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0,
  },
});

export default TabLayout;