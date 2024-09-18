import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import CustomCard from '@/components/CustomCard';
import Header from '@/components/home/Headers';
import AddDeviceCard from '@/components/home/AddDeviceCard'; // Ensure correct import

export default function Index() {
  const [devices, setDevices] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const renderDevice = ({ item, index }: { item: number, index: number }) => (
    <CustomCard
      key={index}
      image="assets/images/favicon.png"
      title={`Device ${index + 1}`}
      paragraph="Device description"
      style={{ zIndex: -1 }}
    />
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}  // Hiển thị 2 thiết bị trên mỗi hàng
        ListEmptyComponent={<AddDeviceCard />}
        contentContainerStyle={styles.deviceListContainer}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#354F63',
    zIndex: 999,
  },
  deviceListContainer: {
    padding: 10,
    zIndex: 999,
  },
});
