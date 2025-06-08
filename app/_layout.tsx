import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (!loaded) return;

    const checkAuth = async () => {
      try {
        const authData = await AsyncStorage.getItem('auth');
        if (authData) {
          // Tunggu layout render dulu sebelum navigasi
          // Tidak langsung router.replace di sini, cukup tandai sudah cek auth
        } else {
          // Sama, tandai sudah cek auth saja
        }
      } catch (error) {
        console.error('Error saat mengambil auth:', error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [loaded]);

  // Setelah auth dicek dan layout siap, lakukan navigasi di effect lain
  useEffect(() => {
    if (!isAuthChecked) return;

    (async () => {
      const authData = await AsyncStorage.getItem('auth');
      if (authData) {
        router.replace('/');  // Misal halaman utama
      } else {
        router.replace('/page/login');  // Halaman login
      }
    })();
  }, [isAuthChecked, router]);

  if (!loaded || !isAuthChecked) {
    // Render sesuatu, misal loading screen
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
