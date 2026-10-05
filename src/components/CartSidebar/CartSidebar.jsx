import { useCart } from '../../context/CartContext';
import './CartSidebar.css';

export default function CartSidebar({ products }) {
  const { state, dispatch } = useCart();
  
  const totalPrice = state.items.reduce((total, item) => {
    const p = products.find(prod => prod.id === item.productId);
    return total + (p ? p.price * item.quantity : 0);
  }, 0);

  const handleCheckout = () => {
    if (state.items.length === 0) return;
    dispatch({ type: 'OPEN_DIALOG', payload: { type: 'checkout', data: { totalPrice } } });
  };

  const handleRemove = (productId, name) => {
    dispatch({ type: 'OPEN_DIALOG', payload: { type: 'remove', data: { productId, name } } });
  };

  return (
    <aside className="cart-sidebar">
      <h2 className="cart-title">Order Summary</h2>
      
      <div className="cart-items-list">
        {state.items.length === 0 ? (
          <div className="empty-cart">Your cart is empty.</div>
        ) : (
          state.items.map(item => {
            const p = products.find(prod => prod.id === item.productId);
            if (!p) return null;
            return (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-img">{p.emoji}</div>
                <div className="cart-item-info">
                  <h4>{p.name}</h4>
                  <div className="cart-item-meta">
                    <span className="cart-item-price">${p.price}</span>
                    <span className="cart-item-qty">x{item.quantity}</span>
                  </div>
                </div>
                <button 
                  className="btn-remove" 
                  onClick={() => handleRemove(item.productId, p.name)}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span>${totalPrice.toLocaleString()}</span>
        </div>
        <button 
          className="btn-checkout" 
          disabled={state.items.length === 0}
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </aside>
  );
}
