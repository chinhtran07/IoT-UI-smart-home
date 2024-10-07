import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, TextInput, Switch } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';

interface Device {
  _id: string;
  name: string;
  status: string;
  type: string;
  properties: (string | number | boolean)[];
}

const DeviceDetail: React.FC = () => {
  const { deviceId } = useLocalSearchParams();
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      if (Array.isArray(deviceId)) {
        console.error('deviceId is an array:', deviceId);
        return;
      }

      try {
        // Lấy thông tin thiết bị theo ID
        const fetchedDevice: Device = await apiClient.get(API_ENDPOINTS.devices.detailed(deviceId));
        setDevice(fetchedDevice);
      } catch (error) {
        console.error('Error fetching device details:', error);
      }
    };

    fetchDeviceDetails();
  }, [deviceId]);

  const onToggle = () => {
    // Logic xử lý bật/tắt thiết bị
    console.log('Toggled device status');
  };

  const onEdit = () => {
    // Logic xử lý chỉnh sửa thiết bị
    console.log('Edit device');
  };

  const onDelete = () => {
    // Logic xử lý xóa thiết bị
    console.log('Delete device');
  };

  if (!device) {
    return <Paragraph>Đang tải thông tin thiết bị...</Paragraph>;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Avatar.Image 
            source={{ uri: 'link-to-image' }} // Thay thế bằng link hình ảnh thực tế
            size={80} 
            style={styles.avatar} 
          />
          <Title style={styles.title}>{device.name}</Title>
          <Paragraph style={styles.detail}>ID: {device._id}</Paragraph>
          <Paragraph style={styles.detail}>Trạng thái: {device.status}</Paragraph>
          <Paragraph style={styles.detail}>Loại: {device.type}</Paragraph>

          {device.type === 'actuator' ? (
            device.properties.map((property: any, index) => {
              const propertyType = typeof property;

              if (propertyType === 'boolean') {
                return (
                  <View key={index} style={styles.controlContainer}>
                    <TextInput 
                      label={`Giá trị thuộc tính ${index + 1}`} 
                      value={property ? 'Bật' : 'Tắt'} 
                      editable={false} 
                    />
                    <Switch 
                      value={property}
                      onValueChange={() => onToggle()} // Thay thế bằng logic điều khiển thực tế
                    />
                  </View>
                );
              } else if (propertyType === 'number') {
                const [sliderValue, setSliderValue] = useState<number>(Number(property));

                return (
                  <View key={index} style={styles.controlContainer}>
                    <TextInput 
                      label={`Giá trị thuộc tính ${index + 1}`} 
                      value={sliderValue.toString()} 
                      editable={false} 
                      style={styles.sliderInput}
                    />
                    <Slider
                      value={sliderValue}
                      minimumValue={0}
                      maximumValue={100} 
                      onValueChange={setSliderValue}
                      onSlidingComplete={() => {
                        console.log(`Cập nhật giá trị: ${sliderValue}`); 
                      }}
                    />
                  </View>
                );
              } else if (propertyType === 'string') {
                return (
                  <View key={index} style={styles.controlContainer}>
                    <TextInput 
                      label={`Giá trị thuộc tính ${index + 1}`} 
                      value={property} 
                      onChangeText={(value) => console.log(`Cập nhật giá trị: ${value}`)} 
                    />
                  </View>
                );
              }
              return null; 
            })
          ) : (
            device.properties.map((property, index) => (
              <Paragraph key={index} style={styles.detail}>
                {`Giá trị thuộc tính ${index + 1}: ${property.toString()}`}
              </Paragraph>
            ))
          )}
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode="contained" onPress={onToggle} style={styles.button}>Bật/Tắt</Button>
          <Button mode="outlined" onPress={onEdit} style={styles.button}>Chỉnh sửa</Button>
          <Button mode="text" onPress={onDelete} style={styles.button}>Xóa</Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    elevation: 5,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 15,
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
  sliderInput: {
    width: '20%',
    marginRight: 10,
  },
});

export default DeviceDetail;
