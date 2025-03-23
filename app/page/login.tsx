import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const router = useRouter();
    navigation.setOptions({ headerShown: false }); // Sembunyikan header di halaman ini
    const handleLogin = async () => {
    
        try {
            await AsyncStorage.setItem('auth', 'user'); // Simpan status login
            router.replace('/'); // Arahkan ke halaman utama
        } catch (error) {
            console.error('Gagal menyimpan status auth:', error);
        }
    };

    const handleOfflineMode = async () => {
        try {
            await AsyncStorage.setItem('auth', 'offline'); // Simpan status offline
            router.replace('/'); // Arahkan ke halaman utama
        } catch (error) {
            console.error('Gagal menyimpan status offline:', error);
        }
    };

    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.offlineButton} onPress={handleOfflineMode}>
                <Text style={styles.offlineText}>Mode Offline</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    offlineButton: {
        marginTop: 15,
    },
    offlineText: {
        color: '#007bff',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
