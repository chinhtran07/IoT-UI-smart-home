import { API_ENDPOINTS } from "@/configs/apiConfig";
import { Colors } from "@/constants/Colors";
import { setAuthToken, setTokenExpiry } from "@/services/authService";
import { login } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, TextInput, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string): boolean => password.length >= 6;

const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = async () => {
        if (!email || !password) {
            return showAlert('Validation Error', 'Please enter both email and password.');
        }
        if (!validateEmail(email)) {
            return showAlert('Validation Error', 'Please enter a valid email address.');
        }
        if (!validatePassword(password)) {
            return showAlert('Validation Error', 'Password must be at least 6 characters long.');
        }

        setLoading(true);

        try {
            const response = await axios.post(API_ENDPOINTS.auth.login, { email, password });

            const { access_token: token, refresh_token, expireIn } = response.data;

            // Kiểm tra xem các giá trị có tồn tại không
            if (!token || !refresh_token || !expireIn) {
                return showAlert('Login Error', 'Failed to retrieve token information.');
            }

            const userResponse = await axios.get(API_ENDPOINTS.users.current_user, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (userResponse.status === 200) {
                dispatch(login({ user: userResponse.data, token }));
                await setAuthToken(token, refresh_token);
                await setTokenExpiry(expireIn);
                router.replace('/(tabs)');
            } else {
                showAlert('User Error', 'Could not retrieve user information.');
            }
        } catch (error) {
            console.error(error);
            showAlert('Login Error', 'An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Image source={require("@/assets/images/logo-app.png")} style={styles.logo} />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        mode="outlined"
                        style={styles.input}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        mode="outlined"
                        style={styles.input}
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.light.tint} />
                    ) : (
                        <Button mode="contained" onPress={handleLogin} style={styles.button}>
                            Login
                        </Button>
                    )}
                    <View style={styles.separator} />
                    <Button mode="outlined" style={styles.googleButton}>
                        Login with Google
                    </Button>
                    <Text style={styles.footerText}>
                        Don't have an account? <Link href={"/signup"} style={styles.link}>Sign Up</Link>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(240, 240, 240, 1)',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        borderRadius: 15,
        borderWidth: 3,
        borderColor: Colors.light.tint,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    input: {
        width: '100%',
        marginBottom: 12,
        backgroundColor: '#ffffff',
        borderColor: Colors.light.tint,
    },
    button: {
        marginTop: 16,
        backgroundColor: Colors.light.tint,
        width: '100%',
        padding: 8,
        borderRadius: 8,
    },
    separator: {
        height: 16,
    },
    googleButton: {
        marginTop: 16,
        borderColor: '#4285F4',
        borderWidth: 1,
        width: '100%',
        padding: 8,
        borderRadius: 8,
    },
    footerText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#666',
    },
    link: {
        color: Colors.light.tint,
        fontWeight: 'bold',
    },
});
