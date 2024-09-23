import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Tabs, usePathname } from "expo-router";
import TabBarIcon from "@/components/navigation/TabBarIcon";

const TabLayout = () => {
  const pathName = usePathname();
  const [isIndexScreen, setIsIndexScreen] = useState(true);
  const [isShowTabBars, setShowTabBars] = useState(true);

  useEffect(() => {
    setIsIndexScreen(pathName === "/");
    // Chỉ hiển thị tab bar nếu không ở màn hình addDevice hoặc addGroup
    setShowTabBars(pathName !== "/groups/addDevice" && pathName !== "/groups/addGroup");
  }, [pathName]);

  return (
    <View style={[styles.container, { backgroundColor: isIndexScreen ? '#354F63' : "#fff" }]}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            display: isShowTabBars ? "flex" : "none",
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
          options={{
            headerShown: false,
            href: null
          }}
        />
        <Tabs.Screen
          name="groups/addGroup"
          options={{
            headerShown: false,
            href: null
          }}
        />
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0,
  },
});

export default TabLayout;
