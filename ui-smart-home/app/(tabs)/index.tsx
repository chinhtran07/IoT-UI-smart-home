import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Dimensions, Appearance } from 'react-native';
import CustomCard from '@/components/CustomCard';
import Header from '@/components/home/Headers';
import AddDeviceCard from '@/components/home/AddDeviceCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import  Colors  from '@/constants/Colors'; // Đảm bảo đường dẫn đúng tới tệp colors

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // Tính toán chiều rộng cho hai cột

export default function Index() {
  const [devices, setDevices] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const colorScheme = Appearance.getColorScheme(); // Nhận chế độ màu hiện tại
  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light; // Chọn màu tương ứng

  const renderDevice = ({ item, index }: { item: number; index: number }) => (
    <CustomCard
      key={index}
      image="assets/images/favicon.png"
      title={`Device ${index + 1}`}
      paragraph="Device description"
      style={{ width: cardWidth, margin: 10, backgroundColor: currentColors.background }} // Sử dụng màu từ tệp colors
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Header />
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
