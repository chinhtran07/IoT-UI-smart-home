import React, { useEffect, useState, useCallback } from "react";
import {
    StyleProp,
    ViewStyle,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { Card, Switch, TextInput, Title } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { API_ENDPOINTS } from "@/configs/apiConfig";
import { Device } from "@/configs/modelsConfig";
import { Colors } from "@/constants/Colors";
import apiClient from "@/services/apiService";
import { socket } from "@/services/socketService";

// Define the props interface for the CardDevice component
type CardDeviceProps = {
    id: string;
    style?: StyleProp<ViewStyle>;
    onLongPress: () => void;
};

const lampOn = require("@/assets/icons/light_on.png"); // Path to the lamp ON image
const lampOff = require("@/assets/icons/light_off.png"); // Path to the lamp OFF image

const CardDevice: React.FC<CardDeviceProps> = React.memo(
    ({ id, style, onLongPress }) => {
        const [device, setDevice] = useState<Device | null>(null);
        const [loading, setLoading] = useState(true);

        // Fetch device details from the API
        const fetchDevice = useCallback(async () => {
            setLoading(true);
            try {
                const { data, status } = await apiClient.get(
                    API_ENDPOINTS.devices.detailed(id)
                );
                if (status === 200) {
                    setDevice(data);
                } else {
                    console.error("Failed to fetch device:", status);
                }
            } catch (error) {
                console.error("Error fetching device:", error);
            } finally {
                setLoading(false);
            }
        }, [id]);

        // Set up socket event handlers
        useEffect(() => {
            const handleConnect = () => console.log("Connected to server");
            const handleDisconnect = () => console.log("Disconnected from server");
            const handleData = (data: any) => {
                console.log(data);
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

            const handleHeartbeat = (data: any) => {
                console.log(data);
                setDevice((prevDevice) =>
                    prevDevice ? { ...prevDevice, isActive: data } : null
                );
            };

            socket.on("connect", handleConnect);
            socket.on("disconnect", handleDisconnect);
            socket.on("data", handleData);
            socket.on("heartbeat", handleHeartbeat);
            socket.emit("subscribe", id);

            return () => {
                socket.off("connect", handleConnect);
                socket.off("disconnect", handleDisconnect);
                socket.off("data", handleData);
                socket.off("heartbeat", handleHeartbeat);
                socket.emit("unsubscribe", id);
            };
        }, [id]);

        useEffect(() => {
            fetchDevice();
        }, [fetchDevice]);

        // Control device properties
        const controlProperty = async (property: string, value: any) => {
            if (!device?.isActive) {
                Alert.alert("Warning", "Device is not online");
                return;
            }

            try {
                const commandValue = typeof value === "boolean" ? !value : value;
                const res = await apiClient.post(API_ENDPOINTS.control, {
                    deviceId: id,
                    command: { [property]: commandValue },
                });

                if (res.status === 204) {
                    setDevice((prevDevice) =>
                        prevDevice
                            ? {
                                ...prevDevice,
                                properties: {
                                    ...prevDevice.properties,
                                    [property]: commandValue,
                                },
                            }
                            : null
                    );
                }
            } catch (error) {
                console.error("Error controlling device:", error);
            }
        };

        // Render individual property values based on type
        const renderPropertyValue = (key: string, value: string | number | boolean) => {
            if (!device) return null;

            const isActuator = device.type === "actuator";

            // Update the renderSwitch function to use images
            const renderSwitch = () => (
                <View style={styles.switchContainer}>
                    <Switch
                        value={value as boolean}
                        onValueChange={() => controlProperty(key, value)}
                        disabled={!device.isActive} // Disable if device is not active
                    />
                    <Image
                        source={value ? lampOn : lampOff} // Use the corresponding image based on the switch value
                        style={styles.lampImage} // Apply styling to the image
                    />
                </View>
            );

            const renderSlider = () => (
                <View style={styles.sliderContainer}>
                    <Slider
                        minimumValue={0}
                        maximumValue={100}
                        value={value as number}
                        onValueChange={(val: number) => controlProperty(key, val.toString())}
                        minimumTrackTintColor={Colors.light.tint}
                        maximumTrackTintColor="#d3d3d3"
                        disabled={!device.isActive} // Disable if device is not active
                    />
                    <Text style={styles.sliderValue}>{value}</Text>
                </View>
            );

            const renderTextInput = () => (
                <TextInput
                    style={styles.textInput}
                    value={value.toString()}
                    onSubmitEditing={(event) => controlProperty(key, event.nativeEvent.text)}
                    editable={device.isActive} // Make editable only if the device is active
                />
            );

            // Determine the type of rendering based on value
            if (isActuator) {
                if (typeof value === "boolean") return renderSwitch();
                if (typeof value === "number") return renderSlider();
                return renderTextInput();
            } else {
                return <Text style={styles.propertyLabel}>{value.toString()}</Text>;
            }
        };

        // Render loading indicator or device information
        if (loading) {
            return (
                <View style={[styles.container, style]}>
                    <ActivityIndicator size="large" color={Colors.light.tint} />
                </View>
            );
        }

        return (
            <TouchableOpacity style={[styles.container, style]} onLongPress={onLongPress}>
                <Card style={[styles.card, { backgroundColor: device?.isActive ? Colors.light.background : '#eeeee4' }]}>
                    <Card.Content style={styles.cardContent}>
                        <Title style={[styles.title, { color: Colors.light.text }]}>
                            {device?.name}
                        </Title>
                        {device?.properties &&
                            Object.entries(device.properties).map(([key, value]) => (
                                <View key={key} style={styles.propertyContainer}>
                                    {renderPropertyValue(key, value)}
                                </View>
                            ))}
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    }
);

// Define styles for the component
const styles = StyleSheet.create({
    container: {
        width: "50%",
        padding: 10,
    },
    card: {
        borderRadius: 10,
        aspectRatio: 1,
        justifyContent: "flex-end",
        position: "relative",
    },
    cardContent: {
        justifyContent: "flex-end",
        paddingBottom: 20,
    },
    title: {
        color: "white",
    },
    propertyContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    propertyLabel: {
        color: "white",
        marginRight: 10,
    },
    textInput: {
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        flex: 1,
        color: "white",
    },
    sliderContainer: {
        width: "100%",
        alignItems: "center",
    },
    sliderValue: {
        color: "white",
        marginTop: 5,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    lampImage: {
        width: 60, // Adjust width as needed
        height: 60, // Adjust height as needed
        marginLeft: 10, // Space between switch and image
    },
});

export default CardDevice;
