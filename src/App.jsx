import { useState, useMemo } from 'react';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import ProductCard from './components/ProductCard/ProductCard';
import CartSidebar from './components/CartSidebar/CartSidebar';
import Dialog from './components/Dialog/Dialog';
import './index.css';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Premium Headphones', price: 299, emoji: '🎧', desc: 'Noise cancellation.' },
  { id: 2, name: 'Smartphone Pro', price: 899, emoji: '📱', desc: 'Next-gen processing.' },
  { id: 3, name: 'Aero Laptop', price: 1299, emoji: '💻', desc: 'Ultra-thin and powerful.' },
  { id: 4, name: 'Cloud Sneakers', price: 149, emoji: '👟', desc: 'Comfortable everyday wear.' },
  { id: 5, name: 'Smartwatch', price: 199, emoji: '⌚', desc: 'Track your health.' },
  { id: 6, name: 'DSLR Camera', price: 549, emoji: '📸', desc: 'Capture stunning photos.' },
];

function ShopContent() {
  const [products] = useState(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="main-container">
        <div style={{ flex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No products found.
            </div>
          )}
        </div>
        <CartSidebar products={products} />
      </main>
      <Dialog />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <ShopContent />
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
