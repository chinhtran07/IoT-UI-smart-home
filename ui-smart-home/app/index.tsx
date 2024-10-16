import { API_ENDPOINTS } from "@/configs/apiConfig";
import { Colors } from "@/constants/Colors";
import { getAuthToken, getRefreshToken, isTokenExpired, setAuthToken } from "@/services/authService";
import { login, logout } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import axios from "axios";
import { SplashScreen, useRouter } from "expo-router";
import { useEffect } from "react";
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function Index() {
  const router = useRouter();
  const scale = new Animated.Value(0.5);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    checkAuthStatus();

    Animated.timing(scale, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, refreshToken] = await Promise.all([getAuthToken(), getRefreshToken()]);
      if (!token) {
        return router.replace('/login');
      }

      if (await isTokenExpired()) {
        return await handleRefreshToken(refreshToken);
      }

      await handleValidToken(token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      router.replace('/login');
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  const handleValidToken = async (token: string) => {
    const userResponse = await axios.get(API_ENDPOINTS.users.current_user, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(login({ user: userResponse.data, token }));
    router.replace('/(tabs)');
  };

  const handleRefreshToken = async (refreshToken: string | null) => {
    if (!refreshToken) {
      dispatch(logout());
      return router.replace('/login');
    }

    const response = await axios.post(API_ENDPOINTS.auth.refresh_token, { refreshToken: refreshToken });
    const { access_token, refresh_token, expireIn } = response.data;

    await setAuthToken(access_token, refresh_token);
    await handleValidToken(access_token);
  };

  return (
    <ImageBackground source={require("@/assets/images/splash.png")} style={styles.container}>
      <View style={styles.overlay} />

      <Animated.View style={{ transform: [{ scale }] }}>
        <Image source={require('@/assets/images/logo-app.png')} style={styles.logo} />
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
    backgroundColor: Colors.light.background,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.light.tint,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 10,
  },
});
