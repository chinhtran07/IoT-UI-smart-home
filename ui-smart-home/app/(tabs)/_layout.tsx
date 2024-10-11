import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Tabs, usePathname } from "expo-router";
import TabBarIcon from "@/components/navigation/TabBarIcon";
import  Colors  from '@/constants/Colors'; 

const TabLayout = () => {
  const pathName = usePathname();
  const [isShowTabBars, setShowTabBars] = useState(true);

  useEffect(() => {
    const regex = /^(\/devices\/.*|\/groups\/.*)$/;
    setShowTabBars(!regex.test(pathName));
  }, [pathName]);

  return (
    <View style={[styles.container]}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarStyle: {
            display: isShowTabBars ? "flex" : "none",
            paddingHorizontal: 10,
            marginHorizontal: 20,
            borderRadius: 20,
            overflow: 'hidden',
            borderTopWidth: 0,
            marginBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            textAlign: "center"
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
          tabBarActiveTintColor: Colors.light.tabIconSelected, // Màu khi tab được chọn
          tabBarInactiveTintColor: Colors.light.tabIconDefault // Màu khi tab không được chọn
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
          name="groups"
          options={{
            tabBarLabel: "Groups",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="grid-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="automations"
          options={{
            tabBarLabel: "Automations",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="settings-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="person-outline" color={color} size={size} />
            ),
            headerShown: false,
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
