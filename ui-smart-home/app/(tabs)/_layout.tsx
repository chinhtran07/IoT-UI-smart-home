import React from "react";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import TabBarIcon from "../../components/navigation/TabBarIcon";

const TabLayout = () => {
    return (
        <View style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#49708F', 
              paddingHorizontal: 10, 
              marginHorizontal: 20,
              marginBottom: 10,
              minHeight: 60,
              borderRadius: 20,
              overflow: 'hidden',
              borderTopWidth: 0
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
            name="devices/index"
            options={{
              tabBarLabel: "Devices",
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="laptop-outline" color={color} size={size} />
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
    
          </Tabs>
          </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#354F63', 
      borderTopWidth: 0
    },
  });

export default TabLayout;