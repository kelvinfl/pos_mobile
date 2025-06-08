import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Pengaturan() {
  const router = useRouter();
  const [pendingSalesCount, setPendingSalesCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const loadPendingSales = async () => {
    try {
      const storedSales = await AsyncStorage.getItem('sales');
      const sales = storedSales ? JSON.parse(storedSales) : [];
      setPendingSalesCount(sales.length);
    } catch (error) {
      console.error('Gagal membaca data penjualan lokal:', error);
    }
  };

  useEffect(() => {
    loadPendingSales();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('auth');
      router.replace('/page/login');
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };

  const handleSyncProduct = () => {
    console.log('Sync Products: Sinkronisasi data produk dari server online');
  };

  const handleSendData = async () => {
    try {
      setIsSending(true);
      const storedSales = await AsyncStorage.getItem('sales');
      const sales = storedSales ? JSON.parse(storedSales) : [];

      if (sales.length === 0) {
        Alert.alert('Info', 'Tidak ada data penjualan yang perlu dikirim.');
        setIsSending(false);
        return;
      }

      for (let i = 0; i < sales.length; i++) {
        const sale = sales[i];

        const fixedItems = sale.items.map((item) => ({
          item_id: item.item_id,
          qty: item.qty ?? 1,
          harga: item.harga,
          total: item.total ?? item.harga * (item.qty ?? 1),
        }));

        const payload = {
          user_id: sale.user_id,
          subtotal: sale.subtotal,
          dibayar: sale.dibayar,
          kembalian: sale.kembalian,
          items: fixedItems,
        };

        const response = await fetch('http://10.0.2.2:8000/api/penjualan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Gagal kirim data penjualan: ${response.status}`);
        }
      }

      await AsyncStorage.removeItem('sales');
      setPendingSalesCount(0); // reset jumlah data
      Alert.alert('Berhasil', 'Semua data penjualan berhasil dikirim.');
    } catch (error) {
      console.error('❌ Gagal mengirim data:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengirim data.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pengaturan Aplikasi</Text>

      <View style={styles.settingGroup}>
        <TouchableOpacity style={styles.button} onPress={handleSyncProduct}>
          <Text style={styles.buttonText}>🔄 Sync Products</Text>
          <Text style={styles.subText}>Sinkronisasi data produk dari server online</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isSending && { opacity: 0.5 }]}
          onPress={handleSendData}
          disabled={isSending}
        >
          <Text style={styles.buttonText}>📤 Send Data to Server</Text>
          <Text style={styles.subText}>
            {pendingSalesCount > 0
              ? `Terdapat ${pendingSalesCount} data penjualan tersimpan`
              : 'Tidak ada data penjualan tersimpan'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>🚪 Logout</Text>
          <Text style={styles.subText}>Keluar dari akun saat ini</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  settingGroup: {
    gap: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
  },
  logoutButton: {
    backgroundColor: '#ffe6e6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },
});
