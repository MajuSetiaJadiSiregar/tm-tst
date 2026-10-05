import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const { dispatch } = useCart();
  const { addToast } = useToast();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { productId: product.id, quantity: qty }
    });
    addToast(`Added ${qty}x ${product.name} to cart`);
    setQty(1);
  };

  const handleQtyChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setQty(isNaN(val) ? 1 : Math.max(1, val));
  };

  return (
    <div className="product-card">
      <div className="product-image">{product.emoji}</div>
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-desc">{product.desc}</p>
      </div>
      <div className="product-actions">
        <input 
          type="number" 
          min="1" 
          value={qty} 
          onChange={handleQtyChange} 
          className="qty-input"
        />
        <button className="btn-add" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
}
