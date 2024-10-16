import TabBarIcon from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { Tabs, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  const pathName = usePathname();
  const shouldHideTabBar = /^(\/devices\/.*|\/groups\/.*)$/.test(pathName);

  return (
    <View style={styles.container}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarStyle: shouldHideTabBar ? styles.hiddenTabBar : styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarActiveTintColor: Colors.light.tabIconSelected,
          tabBarInactiveTintColor: Colors.light.tabIconDefault,
        }}
      >
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
          name="accessories"
          options={{
            tabBarLabel: "Accessories",
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0,
  },
  tabBar: {
    display: "flex",
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderTopWidth: 0,
    marginBottom: 10,
  },
  hiddenTabBar: {
    display: "none",
  },
  tabBarLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  tabBarIcon: {
    marginBottom: 0,
  },
});
