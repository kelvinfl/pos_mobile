import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('Menu'); // State untuk tab aktif

  // Fungsi untuk menangani navigasi
  const handleNavigation = (route) => {
    setActiveTab(route); // Set tab aktif
    router.push(`/(tabs)/${route}`); // Navigasi ke halaman yang sesuai
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('index')} // Navigasi ke halaman Menu
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={activeTab === 'Menu' ? '#4A90E2' : '#666'} // Warna ikon tetap sama
        />
        <Text 
          style={[
            styles.navText,
            activeTab === 'Menu' && styles.activeNavText // Warna teks tetap sama
          ]}
        >
          Menu
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('transaksi')} // Navigasi ke halaman Transaksi
      >
        <Ionicons 
          name="receipt-outline" 
          size={24} 
          color={activeTab === 'Transaksi' ? '#4A90E2' : '#666'} // Warna ikon tetap sama
        />
        <Text 
          style={[
            styles.navText,
            activeTab === 'Transaksi' && styles.activeNavText // Warna teks tetap sama
          ]}
        >
          Transaksi
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('sinkronisasi')} // Navigasi ke halaman Sinkronisasi
      >
        <Ionicons 
          name="sync-outline" 
          size={24} 
          color={activeTab === 'Sinkronisasi' ? '#4A90E2' : '#666'} // Warna ikon tetap sama
        />
        <Text 
          style={[
            styles.navText,
            activeTab === 'Sinkronisasi' && styles.activeNavText // Warna teks tetap sama
          ]}
        >
          Sinkronisasi
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('pengaturan')} // Navigasi ke halaman Pengaturan
      >
        <Ionicons 
          name="settings-outline" 
          size={24} 
          color={activeTab === 'Pengaturan' ? '#4A90E2' : '#666'} // Warna ikon tetap sama
        />
        <Text 
          style={[
            styles.navText,
            activeTab === 'Pengaturan' && styles.activeNavText // Warna teks tetap sama
          ]}
        >
          Pengaturan
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white', // Latar belakang tetap putih
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee', // Warna border tetap sama
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666', // Warna teks tetap sama
  },
  activeNavText: {
    color: '#4A90E2', // Warna teks aktif tetap sama
    fontWeight: 'bold',
  },
});

export default BottomNav;