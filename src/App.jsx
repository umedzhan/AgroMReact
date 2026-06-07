import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import { HomeScreen, ProductScreen, CartScreen, LoginScreen, RegisterScreen, ShippingScreen, ProductListScreen, ProductEditScreen, ProfileScreen, UserListScreen, PaymentScreen, PlaceOrderScreen, OrderScreen, OrderListScreen, ShopScreen, AdminDashboardScreen, WishlistScreen, ContactScreen, AboutScreen, CertificationScreen, ExportScreen, ContractsScreen, CheckoutScreen, OrdersScreen } from './screens';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';

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
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/register" element={<RegisterScreen />} />
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/search/:keyword" element={<HomeScreen />} />
                  <Route path="/page/:pageNumber" element={<HomeScreen />} />
                  <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
                  <Route path="/product/:id" element={<ProductScreen />} />
                  <Route path="/cart" element={<CartScreen />} />
                  <Route path="/shop" element={<ShopScreen />} />
                  <Route path="/pages" element={<HomeScreen />} />
                  <Route path="/blog" element={<HomeScreen />} />
                  <Route path="/about" element={<AboutScreen />} />
                  <Route path="/contact" element={<ContactScreen />} />
                  <Route path="/faqs" element={<HomeScreen />} />
                  <Route path="/terms" element={<HomeScreen />} />
                  <Route path="/privacy" element={<HomeScreen />} />

                  {/* Private Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/shipping" element={<ShippingScreen />} />
                    <Route path="/payment" element={<PaymentScreen />} />
                    <Route path="/placeorder" element={<PlaceOrderScreen />} />
                    <Route path="/checkout" element={<CheckoutScreen />} />
                    <Route path="/orders" element={<OrdersScreen />} />
                    <Route path="/certification" element={<CertificationScreen />} />
                    <Route path="/export" element={<ExportScreen />} />
                    <Route path="/contracts" element={<ContractsScreen />} />
                    <Route path="/order/:id" element={<OrderScreen />} />
                    <Route path="/wishlist" element={<WishlistScreen />} />
                    <Route path="/order-history" element={<OrdersScreen />} />
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
