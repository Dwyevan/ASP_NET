import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Theme
import './assets/wine-theme.css';

// Context
import { CartProvider } from './components/CartProvider';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import AIConsultantChat from './components/AIConsultantChat';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100">
          <Header />
          
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <AIConsultantChat />
          <Toast />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;