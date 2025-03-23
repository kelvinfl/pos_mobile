import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

export default function Success() {
  const router = useRouter();
  const navigation = useNavigation();
  const [animationSource, setAnimationSource] = useState(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Sembunyikan header di halaman ini

    const fetchLottie = async () => {
      try {
        const response = await fetch('https://lottie.host/099eacd6-1e55-4fb3-aadc-8709934fceab/fgd4GVVGOQ.json');
        const json = await response.json();
        setAnimationSource(json);
      } catch (error) {
        console.error('Gagal mengambil animasi:', error);
      }
    };

    fetchLottie();
  }, []);

  return (
    <View style={styles.container}>
      {animationSource && (
        <LottieView 
          source={animationSource}
          autoPlay
          loop={true}
          style={styles.lottie}
        />
      )}
      <Text style={styles.title}>Pembayaran Berhasil!</Text>
      <Text style={styles.message}>Terima kasih telah berbelanja.</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/')}
      >
        <Text style={styles.buttonText}>Kembali ke Menu Utama</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  lottie: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
