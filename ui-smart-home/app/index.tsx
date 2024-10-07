import React, { useEffect } from "react";
import { View, StyleSheet, ImageBackground, Animated, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import { getAuthToken, isTokenExpired } from "@/services/authService";
import { Text } from "react-native-paper";
import  Colors  from '@/constants/Colors'; // Đường dẫn tới file Colors.js

export default function SplashScreenComponent() {
  const router = useRouter();
  const scale = new Animated.Value(0.5);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    
    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        const expired = await isTokenExpired();

        // Tạo hoạt ảnh xuất hiện cho logo
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start();

        setTimeout(async () => {
          if (token && !expired) {
            router.replace("/(tabs)");
          } else {
            router.replace("/login");
          }

          await SplashScreen.hideAsync();
        }, 5000);
      } catch (error) {
        console.error("Error checking authentication:", error);
        await SplashScreen.hideAsync();
      }
    };

    checkAuth();
  }, [router]);

  return (
    <ImageBackground
      source={require('@/assets/images/splash-screen.jpg')}
      style={styles.container}
    >
      {/* Mờ hình nền */}
      <View style={styles.overlay} />
      
      <Animated.View style={{ transform: [{ scale }] }}>
        <Image
          source={require('@/assets/images/logo-app.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>SmartHome</Text>
      </Animated.View>
      <Text style={styles.subtitle}>Kết nối dễ dàng, cuộc sống tiện nghi</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.background, // Sử dụng màu nền từ Colors
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.light.tint, // Sử dụng màu viền từ Colors
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text, // Sử dụng màu chữ từ Colors
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.text, // Sử dụng màu chữ từ Colors
    textAlign: 'center',
    marginTop: 10,
  },
});

