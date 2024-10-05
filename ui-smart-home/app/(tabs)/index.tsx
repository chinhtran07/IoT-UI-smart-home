import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Dimensions, Appearance } from 'react-native';
import CustomCard from '@/components/CustomCard';
import AddDeviceCard from '@/components/home/AddDeviceCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors'; // Ensure correct path to colors
import ReusableHeader from '@/components/Header'; // Import the reusable header
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // Calculate width for two columns

export default function Index() {
  const [devices, setDevices] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const colorScheme = Appearance.getColorScheme(); // Get current color scheme
  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light; // Choose corresponding colors
  const router = useRouter();

  const renderDevice = ({ item, index }: { item: number; index: number }) => (
    <CustomCard
      key={index}
      image="assets/images/favicon.png"
      title={`Device ${index + 1}`}
      paragraph="Device description"
      style={{ width: cardWidth, margin: 10, backgroundColor: currentColors.background }} // Use color from colors file
    />
  );

  // Menu items for the reusable header
  const menuItems = [
    { label: "Add Device", onPress: () => router.replace('/(tabs)/groups/addDevice') },
    { label: "Add Group", onPress: () => router.replace('/(tabs)/groups/addGroup') },
    { label: "Add Automation", onPress: () => router.replace('/(tabs)/automations/addAutomation') },
  ];

  const handleLeftMenuSelect = (option: string) => {
    console.log(`Selected option: ${option}`);
    // Implement your logic for handling left menu selection
  };



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <ReusableHeader
        title="My Home"
        leftMenuOptions={["Home 1", "Home 2", "Home 3"]} // Example left menu options
        onLeftMenuSelect={handleLeftMenuSelect}
        menuItems={menuItems}
      />
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} 
        ListEmptyComponent={<AddDeviceCard />}
        contentContainerStyle={styles.deviceListContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deviceListContainer: {
    padding: 10,
    paddingBottom: 20,
  },
});
