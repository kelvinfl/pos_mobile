import { View, Text, StyleSheet } from 'react-native';

export default function pengaturan() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halaman Pengaturan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Latar belakang putih
    justifyContent: 'center', // Pusatkan konten secara vertikal
    alignItems: 'center', // Pusatkan konten secara horizontal
  },
  text: {
    fontSize: 18,
    color: '#333', // Warna teks gelap agar terlihat jelas
  },
});