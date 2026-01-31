import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import { HomeScreen, ProductScreen, CartScreen, LoginScreen, RegisterScreen, ShippingScreen, ProductListScreen, ProductEditScreen, ProfileScreen, UserListScreen, PaymentScreen, PlaceOrderScreen, OrderScreen, OrderListScreen, ShopScreen, AdminDashboardScreen, WishlistScreen } from './screens';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Toaster position="top-right" />
                <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/search/:keyword" element={<HomeScreen />} />
                  <Route path="/page/:pageNumber" element={<HomeScreen />} />
                  <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
                  <Route path="/product/:id" element={<ProductScreen />} />
                  <Route path="/cart" element={<CartScreen />} />
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/register" element={<RegisterScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/shipping" element={<ShippingScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/placeorder" element={<PlaceOrderScreen />} />
                  <Route path="/order/:id" element={<OrderScreen />} />
                  {/* Shop Route */}
                  <Route path="/shop" element={<ShopScreen />} />
                  <Route path="/pages" element={<HomeScreen />} />
                  <Route path="/blog" element={<HomeScreen />} />
                  <Route path="/about" element={<HomeScreen />} />
                  <Route path="/contact" element={<HomeScreen />} />
                  <Route path="/wishlist" element={<WishlistScreen />} />
                  <Route path="/order-history" element={<OrderScreen />} /> {/* Redirect to generic order screen or home for now */}
                  <Route path="/faqs" element={<HomeScreen />} />
                  <Route path="/terms" element={<HomeScreen />} />
                  <Route path="/privacy" element={<HomeScreen />} />
                  <Route path="/track-order" element={<HomeScreen />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute />}>
                    <Route path="dashboard" element={<AdminDashboardScreen />} />
                    <Route path="productlist" element={<ProductListScreen />} />
                    <Route path="productlist/:pageNumber" element={<ProductListScreen />} />
                    <Route path="product/create" element={<ProductEditScreen />} />
                    <Route path="product/:id/edit" element={<ProductEditScreen />} />
                    <Route path="userlist" element={<UserListScreen />} />
                    <Route path="orderlist" element={<OrderListScreen />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
