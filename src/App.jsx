import { useState, useMemo } from 'react';
import './index.css';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Quantum Headphones X', price: 299, emoji: '🎧', desc: 'Immersive sound with AI noise cancellation.' },
  { id: 2, name: 'Nexus Smartphone Pro', price: 899, emoji: '📱', desc: 'Next-gen processing power in your pocket.' },
  { id: 3, name: 'Aero Laptop 15"', price: 1299, emoji: '💻', desc: 'Ultra-thin, ultra-powerful.' },
  { id: 4, name: 'Cloud Sneakers', price: 149, emoji: '👟', desc: 'Walk on air with smart cushioning.' },
  { id: 5, name: 'Nova Smartwatch', price: 199, emoji: '⌚', desc: 'Track your health and time elegantly.' },
  { id: 6, name: 'Zenith Camera', price: 549, emoji: '📸', desc: 'Capture moments in stunning 8K.' },
];

function App() {
  const [products] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [dialog, setDialog] = useState({ isOpen: false, type: '', payload: null });
  const [qtyInputs, setQtyInputs] = useState({}); // Store qty input for each product

  // Derived state
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const cartTotalQty = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  }, [cart, products]);

  // Actions
  const handleQtyChange = (productId, val) => {
    const value = parseInt(val, 10);
    setQtyInputs(prev => ({ ...prev, [productId]: isNaN(value) ? 1 : Math.max(1, value) }));
  };

  const addToCart = (product) => {
    const qtyToAdd = qtyInputs[product.id] || 1;
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item);
      }
      return [...prev, { productId: product.id, quantity: qtyToAdd }];
    });

    // Reset qty input
    setQtyInputs(prev => ({ ...prev, [product.id]: 1 }));

    // Show Notification
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message: `Added ${qtyToAdd}x ${product.name} to cart!` }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const requestRemoveItem = (productId) => {
    const product = products.find(p => p.id === productId);
    setDialog({ isOpen: true, type: 'remove', payload: product });
  };

  const requestCheckout = () => {
    if (cart.length === 0) return;
    setDialog({ isOpen: true, type: 'checkout', payload: null });
  };

  const confirmDialog = () => {
    if (dialog.type === 'remove') {
      setCart(prev => prev.filter(item => item.productId !== dialog.payload.id));
    } else if (dialog.type === 'checkout') {
      setCart([]);
      const id = Date.now();
      setNotifications(prev => [...prev, { id, message: `Checkout successful! Thank you.` }]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    }
    setDialog({ isOpen: false, type: '', payload: null });
  };

  return (
    <>
      <header className="header">
        <div className="brand">NexusStore</div>
        <input 
          type="text" 
          className="search-box" 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="cart-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartTotalQty > 0 && <div className="cart-badge">{cartTotalQty}</div>}
        </div>
      </header>

      <main className="main-container">
        <section className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-emoji">{product.emoji}</div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {product.desc}
                </p>
              </div>
              <div className="add-to-cart-controls">
                <input 
                  type="number" 
                  className="qty-input" 
                  min="1" 
                  value={qtyInputs[product.id] || 1} 
                  onChange={(e) => handleQtyChange(product.id, e.target.value)}
                />
                <button className="btn" onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No products found for "{searchQuery}".
            </div>
          )}
        </section>

        <aside className="cart-sidebar">
          <h2 style={{ marginBottom: '1rem' }}>Your Cart</h2>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Cart is empty.</p>
            ) : (
              cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-emoji">{product?.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{product?.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          ${product?.price} x {item.quantity}
                        </div>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => requestRemoveItem(item.productId)}>✕</button>
                  </div>
                )
              })
            )}
          </div>
          
          <div className="cart-total">
            <h3><span>Total:</span> <span>${cartTotalPrice.toLocaleString()}</span></h3>
            <button 
              className="btn" 
              style={{ width: '100%' }}
              disabled={cart.length === 0}
              onClick={requestCheckout}
            >
              Checkout Now
            </button>
          </div>
        </aside>
      </main>

      {/* Dialog Overlay */}
      {dialog.isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h2>{dialog.type === 'remove' ? 'Remove Item' : 'Confirm Checkout'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {dialog.type === 'remove' 
                ? `Are you sure you want to remove ${dialog.payload?.name} from your cart?`
                : `You are about to purchase ${cartTotalQty} items for a total of $${cartTotalPrice.toLocaleString()}. Proceed?`
              }
            </p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setDialog({ isOpen: false, type: '', payload: null })}>Cancel</button>
              <button className={`btn ${dialog.type === 'remove' ? 'btn-danger' : ''}`} onClick={confirmDialog}>
                {dialog.type === 'remove' ? 'Remove' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(note => (
          <div key={note.id} className="notification-toast">
            <span>✓</span> {note.message}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
