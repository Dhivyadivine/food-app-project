import React, { createContext, useReducer, useContext } from 'react';

// --- MOCK DATA & CONSTANTS (Data is local to this store) ---
const restaurantData = [
  { id: 1, name: 'South Indian Veg', subTitle: 'Annapoorna Pure Veg', rating: 4.8, time: '20-30 mins', type: 'Veg', color: 'bg-indigo-600', menu: [{ id: 101, name: 'Mini Sambar Idli', price: 120, desc: 'Soft idlis.', type: 'Veg', price: 120 }] },
  { id: 2, name: 'Chicken Biryani Special', subTitle: 'Al Faisal Biryani House', rating: 4.5, time: '25-35 mins', type: 'Non-Veg', color: 'bg-red-700', menu: [{ id: 201, name: 'Chicken Biryani', price: 280, desc: 'Classic Ambur style.', type: 'Non-Veg', price: 280 }] },
  { id: 3, name: 'North Indian Eats', subTitle: 'Modern Chapati & Grills', rating: 4.2, time: '30-40 mins', type: 'Veg', color: 'bg-teal-600', menu: [{ id: 302, name: 'Paneer Tikka Masala', price: 240, desc: 'Smoked paneer.', type: 'Veg', price: 240 }] },
  { id: 4, name: 'Shawarma Wraps', subTitle: 'Global Shawarma Spot', rating: 4.6, time: '25-35 mins', type: 'Non-Veg', color: 'bg-orange-500', menu: [{ id: 401, name: 'Chicken Shawarma Roll', price: 200, desc: 'Classic chicken.', type: 'Non-Veg', price: 200 }] },
];

const DELIVERY_FEE = 30;
const PLATFORM_FEE = 5; 
const GST_RATE = 0.05; 

const initialState = {
  cart: [],
  address: 'Plot No 1, Main Street, T. Nagar, Chennai - 600017, Tamil Nadu, India.', 
  orderStatus: 'home', 
  selectedRestaurant: null,
  priceDetails: { subtotal: 0, delivery: 0, platform: 0, gst: 0, total: 0 },
  restaurants: restaurantData, 
};

const calculateTotal = (cart) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  if (subtotal === 0) return { subtotal: 0, delivery: 0, platform: 0, gst: 0, total: 0 };
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const platform = PLATFORM_FEE;
  const gst = subtotal * GST_RATE; 
  const total = subtotal + delivery + platform + gst;
  return { subtotal, delivery, platform, gst: parseFloat(gst.toFixed(2)), total: parseFloat(total.toFixed(2)) };
};

// Reducer (Handles state changes based on dispatched actions)
function appReducer(state, action) {
  let updatedCart;
  let newPriceDetails;

  switch (action.type) {
    case 'SET_SCREEN': return { ...state, orderStatus: action.payload };
    case 'SELECT_RESTAURANT': return { ...state, selectedRestaurant: action.payload, orderStatus: 'menu', cart: [], priceDetails: calculateTotal([]) };
    case 'ADD_ITEM': {
      const { id } = action.payload;
      const existingItem = state.cart.find(item => item.id === id);
      updatedCart = existingItem 
        ? state.cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...state.cart, { ...action.payload, quantity: 1 }];
      newPriceDetails = calculateTotal(updatedCart);
      return { ...state, cart: updatedCart, priceDetails: newPriceDetails };
    }
    case 'UPDATE_QUANTITY': {
        const { id, quantity } = action.payload;
        updatedCart = quantity > 0 
            ? state.cart.map(item => item.id === id ? { ...item, quantity: quantity } : item)
            : state.cart.filter(item => item.id !== id);
        newPriceDetails = calculateTotal(updatedCart);
        return { ...state, cart: updatedCart, priceDetails: newPriceDetails };
    }
    case 'UPDATE_ADDRESS': return { ...state, address: action.payload };
    case 'PLACE_ORDER': return { ...state, orderStatus: 'success' };
    case 'RESET_APP': return initialState;
    default: return state;
  }
}

// Context Setup and Hook
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (<AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>);
};
export const useAppContext = () => useContext(AppContext);
export default AppContext;