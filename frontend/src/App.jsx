import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // To be created: Wraps pages with Navbar and Footer
import HomePage from './pages/HomePage'; // To be created
import ProductListingPage from './pages/ProductListingPage'; // To be created
import ProductDetailPage from './pages/ProductDetailPage'; // To be created
import CartPage from './pages/CartPage'; // To be created
import CheckoutPage from './pages/CheckoutPage'; // To be created
import AuthPage from './pages/AuthPage'; // To be created (for Login/Signup)
import UserProfilePage from './pages/UserProfilePage'; // To be created (Buyer Profile)
import OrderHistoryPage from './pages/OrderHistoryPage'; // To be created (Buyer Order History)
import SellerDashboardPage from './pages/SellerDashboardPage'; // To be created
import ProductFormPage from './pages/ProductFormPage'; // To be created (for Add/Edit Product by Seller)
import SellerOrdersPage from './pages/SellerOrdersPage'; // To be created (Seller Order Management)
import FAQPage from './pages/FAQPage'; // To be created
// import PrivateRoute from './components/PrivateRoute'; // To be created for protected routes

// Ensure Tailwind's base, components, and utilities are included.
// This is typically done in index.css which is imported in main.jsx or here.
// If not already handled by PostCSS plugin in Vite, ensure index.css has @tailwind directives.
import './index.css'; 

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* Example of how PrivateRoute might be used later for checkout */}
        {/* <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} /> */}
        <Route path="/checkout" element={<CheckoutPage />} /> 
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Buyer specific routes - will likely need PrivateRoute */}
        <Route path="/profile" element={<UserProfilePage />} /> 
        <Route path="/orders" element={<OrderHistoryPage />} />

        {/* Seller specific routes - will likely need PrivateRoute */}
        <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
        <Route path="/seller/products/new" element={<ProductFormPage />} /> 
        <Route path="/seller/products/edit/:productId" element={<ProductFormPage />} /> 
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
        
        <Route path="/faq" element={<FAQPage />} />
        
        {/* Catch-all 404 Not Found Route */}
        <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '50px' }}><h2>404 - Page Not Found</h2><p>Sorry, the page you are looking for does not exist.</p></div>} />
      </Routes>
    </Layout>
  );
}

export default App;
