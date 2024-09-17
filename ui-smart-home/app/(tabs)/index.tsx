import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import CustomCard from '@/components/CustomCard';
import Header from '@/components/home/Headers';
import AddDeviceCard from '@/components/home/AddDeviceCard'; // Ensure correct import

export default function Index() {
  const [devices, setDevices] = useState([1]);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.deviceListContainer}>
        {devices.length > 0 ? (
          devices.map((device, index) => (
            <CustomCard
              key={index}
              image="assets/images/light-bulb.png"
              title={`Device ${index + 1}`}
              paragraph="Device description"
            />
          ))
        ) : (
          <AddDeviceCard />
        )}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#354F63',
  },
  deviceListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
});
