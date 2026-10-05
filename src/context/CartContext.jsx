import { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  dialog: { isOpen: false, type: '', payload: null }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(item => item.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item => 
            item.productId === action.payload.productId 
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_DIALOG':
      return { ...state, dialog: { isOpen: true, type: action.payload.type, payload: action.payload.data } };
    case 'CLOSE_DIALOG':
      return { ...state, dialog: { isOpen: false, type: '', payload: null } };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
