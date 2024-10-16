import { API_ENDPOINTS } from "@/configs/apiConfig";
import { Device } from "@/configs/modelsConfig";
import { Trigger, useTriggerContext } from "@/context/TriggerContext";
import apiClient from "@/services/apiService";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker"

interface ResponseData {
  currentPage: number;
  data: Device[];
  total: number;
  totalPages: number;
}

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [timeRange, setTimeRange] = useState({ start: new Date(), end: new Date() });
  const [showPicker, setShowPicker] = useState({ start: false, end: false });
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { addTrigger } = useTriggerContext();

  const fetchDevices = useCallback(async (pageNum: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await apiClient.get<ResponseData>(
        `${API_ENDPOINTS.devices.by_owner}?page=${pageNum}`
      );
      if (res.status === 200) {
        const { data: newDevices, totalPages } = res.data;
        setDevices((prevDevices) => [...prevDevices, ...newDevices]);
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

  const handleTimeChange = (type: 'start' | 'end', selectedDate: Date | undefined) => {
    const currentDate = selectedDate || timeRange[type];
    setShowPicker((prev) => ({ ...prev, [type]: false }));
    setTimeRange((prev) => ({ ...prev, [type]: currentDate }));
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 8); // HH:mm:ss
  };

  const handleConfirm = () => {
    if (timeRange.start >= timeRange.end) {
      Alert.alert("Invalid Time Selection", "Start time must be before end time.");
      return;
    }
    const newTrigger: Trigger = {
      type: 'time',
      startTime: formatTime(timeRange.start),
      endTime: formatTime(timeRange.end),
    };
    addTrigger(newTrigger);
    setModalVisible(false);
    router.back();
  };

  const renderItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => router.push(`/triggers/${item.id}`)}
    >
      <Text style={styles.deviceName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          headerShown: true,
          headerTitle: "Trigger",
          headerTitleAlign: "center",
        }}
      />
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Button
                mode="contained"
                style={styles.button}
                icon="clock-outline"
                onPress={() => setModalVisible(true)}
              >
                Time
              </Button>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data</Text>
          </View>
        }
        contentContainerStyle={styles.scrollContainer}
      />

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <TouchableOpacity onPress={() => setShowPicker((prev) => ({ ...prev, start: true }))} style={styles.timePicker}>
              <Text style={styles.timeText}>Start Time: {formatTime(timeRange.start)}</Text>
            </TouchableOpacity>
            {showPicker.start && (
              <DateTimePicker
                value={timeRange.start}
                mode="time"
                is24Hour
                display="default"
                onChange={(event, date) => handleTimeChange('start', date)}
              />
            )}
            <TouchableOpacity onPress={() => setShowPicker((prev) => ({ ...prev, end: true }))} style={styles.timePicker}>
              <Text style={styles.timeText}>End Time: {formatTime(timeRange.end)}</Text>
            </TouchableOpacity>
            {showPicker.end && (
              <DateTimePicker
                value={timeRange.end}
                mode="time"
                is24Hour
                display="default"
                onChange={(event, date) => handleTimeChange('end', date)}
              />
            )}
            <Button mode="contained" onPress={handleConfirm} style={styles.confirmButton}>
              Confirm
            </Button>
            <Button mode="text" onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: "rgba(255,255,255,0.7)",
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: '#6200ea',
  },
  deviceItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timePicker: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
  },
});
