import { useQR } from "@/context/QrContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    AppState,
    Linking,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Scanner() {
    const router = useRouter();
    const { setQrData } = useQR();


    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleBarcodeScanned = async (data: string) => {
        if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
                console.log("data", data);
                setQrData(data);
                router.back();
            }, 500);
        }
    };

    return (
        <SafeAreaView style={[styles.container]}>
            <Stack.Screen
                options={{
                    title: "Overview",
                    headerShown: false,
                }}
            />
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={({ data }) => handleBarcodeScanned(data)} // Gọi hàm xử lý quét mã
            />
            <View style={styles.overlay}>
                <View style={styles.blurBackground} />
                <View style={styles.scanFrame} />
                <View style={styles.overlayTextContainer}>
                    <Text style={styles.overlayText}>Position QR code within frame</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    blurBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 4,
        borderColor: "#00FF00", // Green border color
        borderRadius: 20,
        backgroundColor: "transparent",
        position: "absolute",
    },
    overlayTextContainer: {
        position: "absolute",
        top: "10%",
        alignItems: "center",
    },
    overlayText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền mờ cho nút
        borderRadius: 25,
        padding: 10,
    },
});
