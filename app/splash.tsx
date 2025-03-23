import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useNavigationContainerRef } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreenPage() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef(); // Pastikan navigasi siap
  const [showSplash, setShowSplash] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Sembunyikan header di halaman ini
    const checkAuth = async () => {
      try {
        const authData = await AsyncStorage.getItem('auth');
        if (navigationRef.isReady()) {
          router.replace(authData ? '/' : '/page/login');
        }
      } catch (error) {
        console.error('Error saat mengambil auth:', error);
      }
    };

    const timer = setTimeout(() => {
      setShowSplash(false);
      checkAuth();
    }, 2000); // Splash 2 detik

    return () => clearTimeout(timer);
  }, [navigationRef]); // Menunggu hingga navigasi siap

  if (showSplash) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>POS MOBILE V.1.0</Text>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
