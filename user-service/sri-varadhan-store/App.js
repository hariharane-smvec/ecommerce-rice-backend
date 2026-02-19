import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ImageBackground,
  StatusBar,
  ScrollView,
} from 'react-native';

// Replace with your Vercel Backend URL
const API_URL = 'https://ecommerce-rice-backend.vercel.app/api';

// Home - Hero + Catalog
function HomeScreen({ addToCart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        // Fallback to local data if API fails
        setProducts([
          { id: '1', name: 'Ponni Boiled Rice', type: 'Boiled', weight: '5kg', price: 350, image: '🍚' },
          { id: '2', name: 'Ponni Boiled Rice', type: 'Boiled', weight: '10kg', price: 680, image: '🍚' },
        ]);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || product.type === selectedType;
    return matchesSearch && matchesType;
  });

  const TYPES = [
    { key: 'all', label: 'All', icon: '📦' },
    { key: 'Boiled', label: 'Boiled', icon: '🍚' },
    { key: 'Raw', label: 'Raw', icon: '🥞' },
    { key: 'Basmati', label: 'Basmati', icon: '✨' },
    { key: 'Specialty', label: 'Specialty', icon: '🌾' },
    { key: 'Flour', label: 'Flour', icon: '🍚' },
  ];

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" backgroundColor={GRADIENT_TOP} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Sri Varadhan Store</Text>
          <Text style={styles.heroSubtitle}>Fresh Tamil Nadu Rice</Text>
          <Text style={styles.heroAddress}>213, Lenin Street, Kosapalayam</Text>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryText}>🚚 30 min delivery</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Ponni, Basmati..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {TYPES.map(type => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.filterChip,
                selectedType === type.key && styles.filterChipActive,
              ]}
              onPress={() => setSelectedType(type.key)}
            >
              <Text style={[
                styles.filterIcon,
                selectedType === type.key && styles.filterIconActive
              ]}>
                {type.icon}
              </Text>
              <Text style={[
                styles.filterLabel,
                selectedType === type.key && styles.filterLabelActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => addToCart(item)}
              activeOpacity={0.9}
            >
              <View style={styles.productEmoji}>{item.image}</View>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productType}>{item.type} · {item.weight}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              <View style={styles.addToCartBtn}>
                <Text style={styles.addToCartText}>ADD</Text>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productGrid}
        />
      </ScrollView>
    </ImageBackground>
  );
}

// Cart Screen
function CartScreen({ cartItems, updateQty, placeOrder }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Your Cart</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>🛒</View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add delicious rice from Home</Text>
        </View>
      ) : (
        <View style={styles.cartContent}>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItemCard}>
                <View style={styles.cartItemLeft}>
                  <Text style={styles.cartEmoji}>{item.image}</Text>
                  <View>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemWeight}>{item.weight}</Text>
                  </View>
                </View>
                <View style={styles.cartItemRight}>
                  <Text style={styles.cartUnitPrice}>₹{item.price}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQty(item.id, -1)}
                    >
                      <Text style={styles.qtyMinus}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNum}>{item.qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQty(item.id, 1)}
                    >
                      <Text style={styles.qtyPlus}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cartTotalPrice}>₹{item.price * item.qty}</Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.checkoutSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalAmount}>₹{total}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery</Text>
              <Text style={styles.deliveryFee}>FREE</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalAmount}>₹{total}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={placeOrder}>
              <Text style={styles.checkoutBtnText}>PLACE ORDER (COD)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// Orders Screen
function OrdersScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Order History</Text>
      <View style={styles.comingSoonCard}>
        <Text style={styles.comingSoonEmoji}>📦</Text>
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonText}>Your past orders and reordering</Text>
      </View>
    </View>
  );
}

// Main App
export default function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      ).filter(item => item.qty > 0)
    );
  };

  const placeOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add rice items first!');
      return;
    }
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Submit Order to Backend
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        total: total,
        customerName: 'Online User',
        customerPhone: '9999999999',
      })
    })
      .then(res => res.json())
      .then(data => {
        Alert.alert(
          '✅ Order Confirmed!',
          `Order #${data.id}\nTotal: ₹${total}\nDelivery: 30 mins\nPayment: Cash on Delivery`,
          [{ text: 'Track Order', onPress: () => Alert.alert('Tracking', 'Driver assigned!') }]
        );
        setCartItems([]);
      })
      .catch(err => {
        console.error('Order Error:', err);
        Alert.alert('Error', 'Failed to place order. Try again.');
      });
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: GRADIENT_TOP,
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Cart">
          {() => <CartScreen cartItems={cartItems} updateQty={updateQty} placeOrder={placeOrder} />}
        </Tab.Screen>
        <Tab.Screen name="Orders" component={OrdersScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Global
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 8,
  },

  // Home Screen
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.1,
  },
  hero: {
    backgroundColor: 'rgba(46,125,50,0.9)',
    padding: 24,
    borderRadius: 20,
    margin: 16,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  heroAddress: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  deliveryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deliveryText: {
    color: 'white',
    fontWeight: '600',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: GRADIENT_TOP,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#666',
  },
  filterIconActive: {
    color: 'white',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterLabelActive: {
    color: 'white',
  },
  productGrid: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  productCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    margin: 6,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  productEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  productType: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: GRADIENT_TOP,
    marginBottom: 12,
  },
  addToCartBtn: {
    backgroundColor: GRADIENT_TOP,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Cart
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
  },
  cartContent: {
    flex: 1,
  },
  cartItemCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '700',
  },
  cartItemWeight: {
    fontSize: 14,
    color: '#666',
  },
  cartItemRight: {
    alignItems: 'flex-end',
  },
  cartUnitPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  qtyMinus: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  qtyPlus: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GRADIENT_TOP,
  },
  qtyNum: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  cartTotalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: GRADIENT_TOP,
    marginTop: 4,
  },
  checkoutSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  deliveryFee: {
    color: GRADIENT_TOP,
    fontWeight: '700',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 20,
    fontWeight: '800',
  },
  grandTotalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: GRADIENT_TOP,
  },
  checkoutBtn: {
    backgroundColor: GRADIENT_TOP,
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Orders
  comingSoonCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 40,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  comingSoonEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Tab Bar
  tabBar: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 70,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});


