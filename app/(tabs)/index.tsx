import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../Components/BottomNav'; // Import BottomNav
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LogBox } from 'react-native';

// Data dummy untuk kategori
const categories = [
  { id: 1, name: 'Semua' },
  { id: 2, name: 'Makanan Utama' },
  { id: 3, name: 'Minuman' },
  { id: 4, name: 'Snack' },
  { id: 5, name: 'Dessert' },
];

// Data awal untuk produk (akan digunakan hanya jika belum ada data di storage)
const defaultProducts = [
  { id: 1, name: 'Nasi Goreng Spesial', price: 25000, category: 'Makanan Utama', image: 'https://img-global.cpcdn.com/recipes/0820c8cf5a5e18aa/1200x630cq70/photo.jpg' },
  { id: 2, name: 'Mie Goreng', price: 20000, category: 'Makanan Utama', image: 'https://assets.unileversolutions.com/v1/123561172.png' },
  { id: 3, name: 'Ayam Bakar', price: 30000, category: 'Makanan Utama', image: 'https://asset.kompas.com/crops/WTuA1Jn_cJEFlr9UgBhA-72n8yI=/3x0:700x465/1200x800/data/photo/2020/12/30/5fec5602f116e.jpg' },
  { id: 4, name: 'Es Teh Manis', price: 5000, category: 'Minuman', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS7dneTYJKYHWK4-uH-t0kEn0cDnDWOjYQeQ&s' },
  { id: 5, name: 'Es Jeruk', price: 6000, category: 'Minuman', image: 'https://opendrinks.io/img/es-jeruk.8e8c9fa9.jpg' },
  { id: 6, name: 'Kentang Goreng', price: 15000, category: 'Snack', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoNgSU5EE6zA0LNQsBMnFhdLFyV3bv3bXX7Q&s' },
  { id: 7, name: 'Es Krim', price: 10000, category: 'Dessert', image: 'https://asset.kompas.com/crops/pNMGp6ddQ59ympR3G6QHc0wi5c4=/350x314:1203x882/1200x800/data/photo/2022/08/17/62fcc65232caf.jpg' },
  { id: 8, name: 'Es Krimw', price: 10000, category: 'Dessert', image: 'https://asset.kompas.com/crops/pNMGp6ddQ59ympR3G6QHc0wi5c4=/350x314:1203x882/1200x800/data/photo/2022/08/17/62fcc65232caf.jpg' },
];

const index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);  // Empty initial state
  const [allProducts, setAllProducts] = useState([]); // State untuk menyimpan semua produk dari storage
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [moneyGiven, setMoneyGiven] = useState('');
  const [change, setChange] = useState(0);
  const router = useRouter();
  const [salesData, setSalesData] = useState([]); // State untuk menyimpan data penjualan
  const [loading, setLoading] = useState(true);
  LogBox.ignoreAllLogs(); // Menyembunyikan semua error dan warning



  // Fungsi untuk menyimpan produk ke AsyncStorage
  const saveProductsToStorage = async (productsData) => {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(productsData));
      console.log('Products berhasil disimpan ke storage');
    } catch (error) {
      console.error('Gagal menyimpan products ke storage:', error);
    }
  };

  // Fungsi untuk mengambil produk dari AsyncStorage
  const getProductsFromStorage = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      
      if (storedProducts) {
        // Jika ada data di storage, gunakan data tersebut
        const parsedProducts = JSON.parse(storedProducts);
        setAllProducts(parsedProducts);
        console.log('Products berhasil diambil dari storage:', parsedProducts.length, 'items');
        return parsedProducts;
      } else {
        // Jika tidak ada data di storage, gunakan data default dan simpan ke storage
        console.log('Tidak ada data products di storage, menggunakan data default');
        await saveProductsToStorage(defaultProducts);
        setAllProducts(defaultProducts);
        return defaultProducts;
      }
    } catch (error) {
      console.error('Gagal mengambil products dari storage:', error);
      // Jika terjadi error, gunakan data default
      setAllProducts(defaultProducts);
      return defaultProducts;
    }
  };

  // Load products dari storage saat aplikasi dimulai
  useEffect(() => {
    const initializeProducts = async () => {
      const loadedProducts = await getProductsFromStorage();
      filterProducts(loadedProducts, selectedCategory, searchQuery);
    };

    initializeProducts();
  }, []);

  // Fungsi untuk memfilter produk berdasarkan kategori dan pencarian
  const filterProducts = (productsList, category, query) => {
    let filtered = [...productsList];
    
    if (category !== 'Semua') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (query) {
      filtered = filtered.filter(
        product => product.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setProducts(filtered);
  };

  // Filter produk ketika kategori atau pencarian berubah
  useEffect(() => {
    filterProducts(allProducts, selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, allProducts]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await AsyncStorage.getItem('auth');
        if (!authData) {
          router.replace('../splash'); // Arahkan ke halaman login jika tidak ada auth
        }
      } catch (error) {
        console.error('Gagal mengambil data auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]); // Pastikan useEffect berjalan saat router berubah


  // Ambil data penjualan dari storage
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const existingSales = await AsyncStorage.getItem('sales');
        if (existingSales) {
          const sales = JSON.parse(existingSales);
          setSalesData(sales); // Simpan ke state
          console.log('Data sales berhasil diambil:', sales.length, 'items'); // Debugging
        } else {
          console.log('Tidak ada data sales tersimpan.');
        }
      } catch (error) {
        console.error('Gagal mengambil data penjualan:', error);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const authData = await AsyncStorage.getItem('auth');
        if (authData) {
          setUsername(authData); // Simpan isi auth ke state
        }
      } catch (error) {
        console.error('Gagal mengambil data auth:', error);
      }
    };

    fetchAuth();
  }, []);

  // Fungsi untuk menambahkan produk ke keranjang
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(
        cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Fungsi untuk mengubah jumlah produk di keranjang
  const updateQuantity = (productId, amount) => {
    setCart(
      cart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  // Hitung total harga di keranjang
  const cartTotal = cart.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  );

  // Format uang dengan tanda koma
  const formatMoney = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Unformat uang (hapus koma)
  const unformatMoney = (value) => {
    return parseFloat(value.replace(/,/g, ''));
  };

  // Hitung kembalian
  const calculateChange = () => {
    const money = unformatMoney(moneyGiven);
    if (!isNaN(money)) {
      const changeAmount = money - cartTotal;
      setChange(changeAmount >= 0 ? changeAmount : 0);
    } else {
      setChange(0);
    }
  };

  // Render item kategori
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.name && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Text 
        style={[
          styles.categoryText,
          selectedCategory === item.name && styles.selectedCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render item produk
  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => addToCart(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          Rp {item.price.toLocaleString('id-ID')}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => addToCart(item)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render item keranjang
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.cartItemImage} 
      />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>
          Rp {item.price.toLocaleString('id-ID')}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, -1)}
        >
          <Ionicons name="remove" size={16} color="white" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, 1)}
        >
          <Ionicons name="add" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSaleItem = ({ item }) => (
    <View style={styles.saleItem}>
      <Text style={styles.saleDate}>
        {new Date(item.date).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
      <Text style={styles.saleTotal}>Total: Rp {item.total.toLocaleString('id-ID')}</Text>
      <Text style={styles.saleChange}>Kembalian: Rp {item.change.toLocaleString('id-ID')}</Text>
      <FlatList
        data={item.items}
        renderItem={({ item: product }) => (
          <View style={styles.saleProduct}>
            <Text style={styles.saleProductName}>{product.name}</Text>
            <Text style={styles.saleProductQuantity}>Jumlah: {product.quantity}</Text>
            <Text style={styles.saleProductPrice}>Harga: Rp {product.price.toLocaleString('id-ID')}</Text>
          </View>
        )}
        keyExtractor={(product) => product.id.toString()}
      />
    </View>
  );

  const handleCheckout = () => {
    const money = unformatMoney(moneyGiven);
    if (money >= cartTotal) {
      saveSaleToLocalStorage();
      Alert.alert('Pembayaran Berhasil', 'Terima kasih telah berbelanja!');
      router.push('/Components/success');
    } else {
      Alert.alert('Pembayaran Gagal', 'Uang yang diberikan tidak cukup!');
    }
  };

  const saveSaleToLocalStorage = async () => {
    const saleData = {
      date: new Date().toISOString(),
      items: cart,
      total: cartTotal,
      moneyGiven: unformatMoney(moneyGiven),
      change: change,
    };
  
    try {
      // Ambil data penjualan yang sudah ada
      const existingSales = await AsyncStorage.getItem('sales');
      const sales = existingSales ? JSON.parse(existingSales) : [];
      
      // Tambahkan penjualan baru
      sales.push(saleData);
      
      // Simpan kembali ke local storage
      await AsyncStorage.setItem('sales', JSON.stringify(sales));
      
      console.log('Data penjualan disimpan:', saleData);
    } catch (error) {
      console.error('Gagal menyimpan data penjualan:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Selamat Datang, {username || 'Kasir'}</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setShowCart(!showCart)}
        >
          <Ionicons name="cart-outline" size={28} color="#333" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
    
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari menu..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          {/* Categories */}
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          />
          
          {/* Products */}
          {showCart ? (
            // Cart View
            <View style={styles.cartContainer}>
              <View style={styles.cartHeader}>
                <Text style={styles.cartTitle}>Keranjang Belanja</Text>
                <TouchableOpacity onPress={() => setCart([])}>
                  <Text style={styles.clearCartText}>Bersihkan</Text>
                </TouchableOpacity>
              </View>
              
              {cart.length > 0 ? (
                <>
                  <FlatList
                    data={cart}
                    renderItem={renderCartItem}
                    keyExtractor={item => item.id.toString()}
                    style={styles.cartList}
                  />
                  
                  <View style={styles.cartFooter}>
                    <View style={styles.cartTotalContainer}>
                      <Text style={styles.cartTotalLabel}>Total:</Text>
                      <Text style={styles.cartTotal}>
                        Rp {cartTotal.toLocaleString('id-ID')}
                      </Text>
                    </View>
                    <View style={styles.moneyInputContainer}>
                      <TextInput
                        style={styles.moneyInput}
                        placeholder="Uang yang diberikan"
                        keyboardType="numeric"
                        value={moneyGiven}
                        onChangeText={(text) => setMoneyGiven(formatMoney(text))}
                        onBlur={() => {
                          calculateChange();
                          Keyboard.dismiss();
                        }}
                        returnKeyType="done"
                      />
                    </View>
                    <View style={styles.changeContainer}>
                      <Text style={styles.changeLabel}>Kembalian:</Text>
                      <Text style={styles.changeAmount}>
                        Rp {change.toLocaleString('id-ID')}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.checkoutButton}
                      onPress={handleCheckout}
                    >
                      <Text style={styles.checkoutButtonText}>Checkout</Text>
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
             
                  </View>
                </>
              ) : (
                <View style={styles.emptyCart}>
                  <Ionicons name="cart" size={80} color="#ddd" />
                  <Text style={styles.emptyCartText}>Keranjang kosong</Text>
                </View>
              )}
  
              
            </View>
            
          ) : (
            // Products View
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.productsList}
            />
          )}
    
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#EA4335',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  categoriesList: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
  },
  selectedCategoryItem: {
    backgroundColor: '#4A90E2',
    height: 50,
  },
  categoryText: {
    color: '#333',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productsList: {
    paddingBottom: 32,
  },
  productItem: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#EA4335',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeNavText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  cartContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearCartText: {
    color: '#EA4335',
    fontSize: 14,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#4A90E2',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cartTotalLabel: {
    fontSize: 16,
    color: '#666',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moneyInputContainer: {
    marginBottom: 16,
  },
  moneyInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  changeLabel: {
    fontSize: 16,
    color: '#666',
  },
  changeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 20
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },

  salesContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  salesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  salesList: {
    paddingBottom: 16,
  },
  saleItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  saleDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  saleTotal: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  saleChange: {
    fontSize: 14,
    color: '#EA4335',
    marginBottom: 8,
  },
  saleProduct: {
    marginLeft: 8,
    marginBottom: 8,
  },
  saleProductName: {
    fontSize: 14,
    color: '#333',
  },
  saleProductQuantity: {
    fontSize: 12,
    color: '#666',
  },
  saleProductPrice: {
    fontSize: 12,
    color: '#666',
  },
});

export default index;