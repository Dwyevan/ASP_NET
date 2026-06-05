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

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100 bg-light-wine">
          <Header />
          
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>

          <Footer />
          <AIConsultantChat />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;