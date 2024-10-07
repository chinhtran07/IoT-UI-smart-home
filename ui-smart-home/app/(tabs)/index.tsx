import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Dimensions, Appearance, ActivityIndicator } from 'react-native';
import CustomCard from '@/components/CustomCard';
import AddDeviceCard from '@/components/home/AddDeviceCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors'; 
import ReusableHeader from '@/components/Header';
import { useRouter } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';

interface Device {
  _id: string;
}

interface ResponseData {
  currentPage: number;
  devices: Device[];
  total: number;
  totalPages: number;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2;

const Index: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchDevices = useCallback(async (pageNum: number) => {
    if (loading || !hasMore) return; // Prevent duplicate requests

    setLoading(true);
    try {
      const res = await apiClient.get<ResponseData>(`${API_ENDPOINTS.devices.by_owner}?page=${pageNum}`);
      if (res.status === 200) {
        const { devices: newDevices, totalPages } = res.data; 
        setDevices(prevDevices => [...prevDevices, ...newDevices]);
        setHasMore(pageNum < totalPages); 
      } else {
        console.error("Failed to fetch devices");
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchDevices(page);
  }, [page, fetchDevices]);

  const loadMoreDevices = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <CustomCard
      key={item._id}
      id={item._id}
      style={{ width: cardWidth, margin: 10}} 
    />
  );

  const menuItems = [
    { label: "Add Device", onPress: () => router.replace('/(tabs)/devices/addDevice') },
    { label: "Add Group", onPress: () => router.replace('/(tabs)/groups/addGroup') },
    { label: "Add Automation", onPress: () => router.replace('/(tabs)/automations/addAutomation') },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ReusableHeader
        title="My Home"
        leftMenuOptions={["Home 1", "Home 2", "Home 3"]}
        onLeftMenuSelect={option => console.log(`Selected option: ${option}`)}
        menuItems={menuItems}
      />
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={item => item._id} 
        numColumns={2} 
        ListEmptyComponent={<AddDeviceCard />}
        contentContainerStyle={styles.deviceListContainer}
        onEndReached={loadMoreDevices}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color={Colors.dark.saveButton} /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deviceListContainer: {
    padding: 10,
    paddingBottom: 20,
  },
});

export default Index;
