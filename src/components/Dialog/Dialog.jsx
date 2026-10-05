import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import './Dialog.css';

export default function Dialog() {
  const { state, dispatch } = useCart();
  const { addToast } = useToast();
  const { isOpen, type, payload } = state.dialog;

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'remove') {
      dispatch({ type: 'REMOVE_ITEM', payload: payload.productId });
    } else if (type === 'checkout') {
      dispatch({ type: 'CLEAR_CART' });
      addToast('Order placed successfully! Thank you.');
    }
    dispatch({ type: 'CLOSE_DIALOG' });
  };

  const handleCancel = () => {
    dispatch({ type: 'CLOSE_DIALOG' });
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{type === 'remove' ? 'Remove Item' : 'Checkout Confirmation'}</h3>
        <p>
          {type === 'remove' 
            ? `Are you sure you want to remove ${payload.name} from your cart?`
            : `Confirm payment of $${payload.totalPrice.toLocaleString()}?`
          }
        </p>
        <div className="dialog-actions">
          <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
          <button className={`btn-confirm ${type === 'remove' ? 'btn-danger' : ''}`} onClick={handleConfirm}>
            {type === 'remove' ? 'Remove' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
