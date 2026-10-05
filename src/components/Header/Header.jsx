import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

export default function Header({ searchQuery, setSearchQuery }) {
  const { state } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const totalQty = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="brand">NexShop<span>.</span></h1>
        
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {isDark ? '☀️' : '🌙'}
          </button>
          
          <div className="cart-icon-container">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
