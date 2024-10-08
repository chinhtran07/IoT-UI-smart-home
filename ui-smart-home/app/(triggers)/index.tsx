import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { useRouter } from 'expo-router';
import { Trigger, useTriggerContext } from '@/context/TriggerContext';

interface Device {
    _id: string;
    name: string;
}

interface ResponseData {
    currentPage: number;
    devices: Device[];
    total: number;
    totalPages: number;
}

const TriggerScreen: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const router = useRouter();
    const { addTrigger } = useTriggerContext();

    const fetchDevices = useCallback(
        async (pageNum: number) => {
            if (loading || !hasMore) return;

            setLoading(true);
            try {
                const res = await apiClient.get<ResponseData>(
                    `${API_ENDPOINTS.devices.by_owner}?page=${pageNum}`
                );
                if (res.status === 200) {
                    const { devices: newDevices, totalPages } = res.data;
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
        },
        [loading, hasMore]
    );

    useEffect(() => {
        fetchDevices(page);
    }, [page, fetchDevices]);

    const handleStartTimeChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || startTime;
        setShowStartPicker(false);
        setStartTime(currentDate);
    };

    const handleEndTimeChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || endTime;
        setShowEndPicker(false);
        setEndTime(currentDate);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleConfirm = () => {
        if (startTime >= endTime) {
            Alert.alert("Invalid Time Selection", "Start time must be before end time.");
            return;
        }
        // Tạo trigger mới và thêm vào context
        const newTrigger = {
            type: 'time',
            startTime: formatTime(startTime),
            endTime: formatTime(endTime),
        };
        addTrigger(newTrigger as Trigger); // Thêm trigger vào context        
        setModalVisible(false); // Đóng modal
        router.back();
    };

    const renderItem = ({ item }: { item: Device }) => (
        <Pressable
            style={styles.deviceItem}
            onPress={() => {
                router.push({
                    pathname: `/(triggers)/trigger`, 
                    params: {
                        deviceId: item._id,
                        deviceName: item.name,
                    },
                });
            }} // Sử dụng router.push
        >
            <Text style={styles.deviceName}>{item.name}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Trigger",
                    headerBackVisible: true,
                    headerTitleAlign: "center"
                }}
            />
            <FlatList
                data={devices}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <View style={styles.gridContainer}>
                        <View style={styles.gridItem}>
                            <Button
                                mode="contained"
                                style={styles.button}
                                icon="clock-outline"
                                onPress={() => setModalVisible(true)} // Open modal on button press
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
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Time</Text>
                        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timePicker}>
                            <Text style={styles.timeText}>Start Time: {formatTime(startTime)}</Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                            <DateTimePicker
                                value={startTime}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={handleStartTimeChange}
                            />
                        )}
                        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timePicker}>
                            <Text style={styles.timeText}>End Time: {formatTime(endTime)}</Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                            <DateTimePicker
                                value={endTime}
                                mode="time"
                                is24Hour={false}
                                display="default"
                                onChange={handleEndTimeChange}
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
        backgroundColor: '#6200ea', // Button background color
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

export default TriggerScreen;
