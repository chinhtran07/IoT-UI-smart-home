import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph, Button, Switch } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { Stack, useLocalSearchParams } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';
import { socket } from '@/services/socketService';

interface Device {
  id: string;
  name: string;
  status: boolean;
  type: string;
  properties: { [key: string]: string | number | boolean };
}

const DeviceDetail: React.FC = () => {
  const { deviceId } = useLocalSearchParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setTransport('N/A');
    };

    const onDataReceived = (data: any) => {
      console.log("Data received from socket:", data);
      setDevice((prevDevice) => prevDevice ? {
        ...prevDevice,
        properties: { ...prevDevice.properties, ...data },
      } : null);
    };

    const onHeartbeat = (data: any) => {
      setDevice((prevDevice) => prevDevice ? {
        ...prevDevice,
        status: data.alive,
      } : null);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on("data", onDataReceived);
    socket.on("heartbeat", onHeartbeat);
    
    // Subscribe to device
    socket.emit("subscribe", device?.id);

    // Cleanup function
    return () => {
      socket.emit("unsubscribe", device?.id);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("data", onDataReceived);
      socket.off("heartbeat", onHeartbeat);
    };
  }, [device?.id]);

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      if (Array.isArray(deviceId)) {
        console.error('deviceId is an array:', deviceId);
        return;
      }

      try {
        const { data } = await apiClient.get(API_ENDPOINTS.devices.detailed(deviceId));
        setDevice({
          id: data.Device.id,
          name: data.Device.name,
          status: data.Device.status,
          type: data.Device.type,
          properties: data.properties,
        });
      } catch (error) {
        console.error('Error fetching device details:', error);
      }
    };

    fetchDeviceDetails();
  }, [deviceId]);

  const controlProperty = async (property: string, value: any) => {
    try {
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

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: device.name,
          headerBackVisible: true,
          headerTitleAlign: "center",
        }}
      />
      <Title style={styles.title}>{device.name}</Title>
      <Paragraph style={styles.detail}>Trạng thái: {device.status ? "Online" : "Offline"}</Paragraph>

      {Object.entries(device.properties).map(([propertyKey, propertyValue], index) => {
        const propertyType = typeof propertyValue;

        return (
          <View key={index} style={styles.controlContainer}>
            <Paragraph>{`Giá trị ${propertyKey}`}</Paragraph>
            {propertyType === 'boolean' ? (
              <Switch
                value={propertyValue as boolean}
                onValueChange={() => controlProperty(propertyKey, propertyValue)}
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
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default DeviceDetail;
