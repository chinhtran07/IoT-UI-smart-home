import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native'; // Import Image here
import { Title, Paragraph, Button, ToggleButton } from 'react-native-paper'; // Import ToggleButton
import Slider from '@react-native-community/slider';
import { Stack, useLocalSearchParams } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { socket } from '@/services/socketService';
import { Device } from '@/configs/modelsConfig';
import { Colors } from '@/constants/Colors';

const lampOn = require("@/assets/icons/light_on.png"); // Path to the lamp ON image
const lampOff = require("@/assets/icons/light_off.png"); // Path to the lamp OFF image

const DeviceDetail: React.FC = () => {
    const { deviceId } = useLocalSearchParams();
    const [device, setDevice] = useState<Device | null>(null);

    useEffect(() => {
        const handleConnect = () => console.log("Connected to server");
        const handleDisconnect = () => console.log("Disconnected from server");
        const handleData = (data: any) => {
            setDevice((prevDevice) => {
                if (!prevDevice) return null;
                const updatedProperties = data
                    ? { ...prevDevice.properties, ...data }
                    : prevDevice.properties;
                const updatedValue = data !== undefined ? data : prevDevice.value;

                return {
                    ...prevDevice,
                    properties: updatedProperties,
                    value: updatedValue,
                };
            });
        };

        const handleHeartbeat = (data: { alive: boolean }) => {
            setDevice((prevDevice) =>
                prevDevice ? { ...prevDevice, isActive: data.alive } : null
            );
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("data", handleData);
        socket.on("heartbeat", handleHeartbeat);
        socket.emit("subscribe", deviceId);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("data", handleData);
            socket.off("heartbeat", handleHeartbeat);
            socket.emit("unsubscribe", deviceId);
        };
    }, [deviceId]);

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            if (Array.isArray(deviceId)) {
                console.error('deviceId is an array:', deviceId);
                return;
            }

            try {
                const res = await apiClient.get(API_ENDPOINTS.devices.detailed(deviceId));
                setDevice(res.data);
            } catch (error) {
                console.error('Error fetching device details:', error);
            }
        };

        fetchDeviceDetails();
    }, [deviceId]);

    const controlProperty = async (property: string, value: any) => {
        try {
            if (!device?.isActive) {
                Alert.alert("Warning", "Device is not online");
                return;
            }
            const commandValue = typeof value === "boolean" ? !value : value;
            const res = await apiClient.post(API_ENDPOINTS.control, {
                deviceId: device?.id,
                command: { [property]: commandValue },
            });

            if (res.status === 204) {
                setDevice((prevDevice) => prevDevice ? {
                    ...prevDevice,
                    properties: { ...prevDevice.properties, [property]: commandValue },
                } : null);
            }
        } catch (error) {
            console.error("Error controlling device:", error);
        }
    };

    const onDelete = () => {
        console.log('Delete device');
    };

    if (!device) {
        return <Paragraph>Đang tải thông tin thiết bị...</Paragraph>;
    }

    const isLightOn = device?.properties?.status === true;

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerBackVisible: true,
                    headerTitle: device.name,
                    headerStyle: {
                        backgroundColor: Colors.header.color
                    },
                    headerTitleStyle: {
                        color: Colors.dark.text
                    },
                    headerTitleAlign: "center",
                }}
            />
            <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, device.isActive ? styles.online : styles.offline]} />
            </View>
            {device.detailType === "Light" && (
                <Image
                    source={isLightOn ? lampOn : lampOff}
                    style={styles.lampImage}
                />
            )}

            {/* Render control elements */}
            {Object.entries(device?.properties || {}).map(([propertyKey, propertyValue], index) => {
                const propertyType = typeof propertyValue;

                return (
                    <View key={index} style={styles.controlContainer}>
                        {propertyType === 'boolean' ? (
                           <ToggleButton
                           icon="power-standby"
                           value={propertyKey}
                           status={propertyValue ? 'checked' : 'unchecked'}
                           onPress={() => controlProperty(propertyKey, propertyValue)}
                           iconColor={propertyValue ? "green" : "red"}  
                           style={[styles.toggleButton, { backgroundColor: propertyValue ? "#d1f5d3" : "gray" }]} // Optional background color
                         />                         
                        ) : propertyType === 'number' ? (
                            <Slider
                                value={Number(propertyValue)}
                                minimumValue={0}
                                maximumValue={100}
                                onValueChange={(value) => controlProperty(propertyKey, value)}
                            />
                        ) : (
                            <Paragraph>{`Giá trị ${propertyKey}: ${propertyValue}`}</Paragraph>
                        )}
                    </View>
                );
            })}

            <View style={styles.actions}>
                <Button mode="text" onPress={onDelete} style={styles.button}>Xóa</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    detail: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 8,
    },
    online: {
        backgroundColor: 'green',
    },
    offline: {
        backgroundColor: 'red',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    controlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    lampImage: {
        width: 300, 
        height: 300, 
        alignSelf: 'center',
        marginBottom: 20,
    },
    toggleButton: {
        borderRadius: 30,
        marginHorizontal: 10,
        elevation: 2,
        height: 60,
        width: 60,
      },
});

export default DeviceDetail;
