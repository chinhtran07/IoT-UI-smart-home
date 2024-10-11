import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    StyleProp,
    ViewStyle,
    Switch,
    Text,
    TextInput,
} from "react-native";
import { Card, Title } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import Colors from '@/constants/Colors';
import apiClient from "@/services/apiService";
import { BASE_URL, API_ENDPOINTS } from "@/configs/apiConfig";
import { useAuth } from "@/context/AuthContext";
import { io } from "socket.io-client"; // Import Socket.IO client
import { socket } from "@/services/socketService";

// Định nghĩa kiểu cho device
interface Device {
    id: string;
    name: string;
    status: boolean;
    type: 'actuator' | 'sensor';
    properties: {
        [key: string]: string | number | boolean;
    };
}

type CustomCardProps = {
    id: string;
    style?: StyleProp<ViewStyle>;
    onLongPress?: () => void;
};

const CustomCard: React.FC<CustomCardProps> = ({ id, style, onLongPress }) => {
    const [device, setDevice] = useState<Device | null>(null);
    const token = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState('N/A');

    // Lấy thông tin chi tiết thiết bị
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await apiClient.get(API_ENDPOINTS.devices.detailed(id));
                if (res.status === 200) {
                    const data = res.data;
                    console.log(data);
                    const obj: Device = {
                        id: data.Device.id,
                        name: data.Device.name,
                        status: data.Device.status,
                        type: data.Device.type,
                        properties: data.properties,
                    };
                    setDevice(obj);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin thiết bị:", error);
            }
        };

        fetchDetail();
    }, [id]);

    // Kết nối đến Socket.IO
    useEffect(() => {

        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on('upgrade', (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport('N/A');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        // Đăng ký lắng nghe dữ liệu từ thiết bị
        socket.on("data", (data: any) => {
            console.log("Data received from socket:", data);
            setDevice((prevDevice) => prevDevice ? {
                ...prevDevice,
                properties: {
                    ...prevDevice.properties,
                    ...data,
                },
            } : null);
        });

        socket.on("heartbeat", (data: any) => {
            console.log(data);
            setDevice((prevDevice) => prevDevice ? {
                ...prevDevice,
                status: data
            } : null);
        })

        // Đăng ký subscribe cho device
        socket.emit("subscribe", id);

        // Dọn dẹp kết nối khi component unmount
        return () => {
            socket.emit("unsubscribe", id);
            socket.disconnect();
        };
    }, [id, token]);

    // Điều khiển thuộc tính thiết bị
    const controlProperty = async (property: string, value: any) => {
        try {
            const commandValue = (typeof value === "boolean") ? !value : value;
            const res = await apiClient.post(API_ENDPOINTS.control, {
                deviceId: id,
                command: {
                    [property]: commandValue,
                },
            });

            if (res.status === 204) {
                setDevice((prevDevice) => (prevDevice ? {
                    ...prevDevice,
                    properties: {
                        ...prevDevice.properties,
                        [property]: commandValue,
                    },
                } : null));
            }
        } catch (error) {
            console.error("Lỗi khi điều khiển thiết bị:", error);
        }
    };

    const renderSwitch = (key: string, value: boolean) => (
        <Switch
            value={value}
            onValueChange={() => controlProperty(key, value)}
        />
    );

    const renderSlider = (key: string, value: number) => (
        <View style={styles.sliderContainer}>
            <Slider
                minimumValue={0}
                maximumValue={100}
                value={value}
                onValueChange={(val: number) => controlProperty(key, val.toString())}
                minimumTrackTintColor={Colors.light.tint}
                maximumTrackTintColor="#d3d3d3"
            />
            <Text style={styles.sliderValue}>{value}</Text>
        </View>
    );

    const renderPropertyValue = (key: string, value: string | number | boolean) => {
        if (!device) return null;

        const isActuator = device.type === 'actuator';

        if (isActuator) {
            if (typeof value === 'boolean') {
                return renderSwitch(key, value);
            } else if (typeof value === 'number') {
                return renderSlider(key, value);
            } else {
                return (
                    <TextInput
                        style={styles.textInput}
                        value={value.toString()}
                        onSubmitEditing={(event) => controlProperty(key, event.nativeEvent.text)}
                    />
                );
            }
        } else {
            return (
                <Text style={styles.propertyLabel}>
                    {value.toString()}
                </Text>
            );
        }
    };

    return (
        <TouchableOpacity style={[styles.container, style]} onLongPress={onLongPress}>
            <Card style={[styles.card]}>
                <Card.Content style={styles.cardContent}>
                    <Title style={[styles.title, { color: Colors.light.text }]}>
                        {device?.name}
                    </Title>
                    {device?.properties && Object.entries(device.properties).map(([key, value]) => (
                        <View key={key} style={styles.propertyContainer}>
                            {renderPropertyValue(key, value)}
                        </View>
                    ))}
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
        padding: 10,
    },
    card: {
        borderRadius: 10,
        aspectRatio: 1,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    imageContainer: {
        position: 'absolute',
        top: -70,
        left: 10,
        borderRadius: 20,
        padding: 8,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 12,
    },
    cardContent: {
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    title: {
        color: 'white',
    },
    propertyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    propertyLabel: {
        color: 'white',
        marginRight: 10,
    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        flex: 1,
        color: 'white',
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'center',
    },
    sliderValue: {
        color: 'white',
        marginTop: 5,
    },
});

export default CustomCard;
