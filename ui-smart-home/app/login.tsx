import React, { useState } from 'react';
import { StyleSheet, View, Alert, Image, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/apiService';
import { API_ENDPOINTS } from '@/configs/apiConfig';

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string): boolean => password.length >= 6;

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Validation Error', 'Please enter both email and password.');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return;
        }
        if (!validatePassword(password)) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
            return;
        }
        
        setLoading(true); // Start loading

        try {
            await login(email, password);
            router.replace('/(tabs)');
        } catch (error) {
            console.error(error);
            Alert.alert('Login Error', 'An error occurred during login. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={require("@/assets/images/splash.png")} style={styles.logo} />
                <Text style={styles.title}>Welcome Back!</Text>
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
                    <ActivityIndicator size="large" color="#6200ee"/>
                ) : (
                    <Button mode="contained" onPress={handleLogin} style={styles.button}>
                        Login
                    </Button>
                )}
                <View style={styles.separator} />
                <Button
                    mode="outlined"
                    style={styles.googleButton}
                >
                    Login with Google
                </Button>
                <Text style={styles.footerText}>
                    Don't have an account? <Text style={styles.link}>Sign Up</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#ffffff',
    },
    button: {
        marginTop: 16,
        backgroundColor: '#6200ee',
    },
    separator: {
        height: 16,
    },
    googleButton: {
        marginTop: 16,
        borderColor: '#4285F4',
        borderWidth: 1,
    },
    footerText: {
        marginTop: 20,
        textAlign: 'center',
    },
    link: {
        color: '#6200ee',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
