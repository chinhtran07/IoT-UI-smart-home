import React, { useState } from 'react';
import { StyleSheet, View, Alert, Image, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string): boolean => password.length >= 6;

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
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
                        Don't have an account? <Text style={styles.link}>Sign Up</Text>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background, // Màu nền từ Colors
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
        borderColor: Colors.light.tint, // Màu viền từ Colors
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
        borderColor: Colors.light.tint, // Màu viền từ Colors
    },
    button: {
        marginTop: 16,
        backgroundColor: Colors.light.tint, // Màu chính từ Colors
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
        color: Colors.light.tint, // Màu từ Colors
        fontWeight: 'bold',
    },
});

export default LoginScreen;
