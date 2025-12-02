import React, { createContext, useReducer, useState, useEffect, useContext } from 'react';

// --- MOCK DATA ---
const restaurantData = [
  { 
    id: 1, 
    name: 'South Indian Veg', 
    subTitle: 'Annapoorna Pure Veg',
    rating: 4.8, 
    time: '20-30 mins', 
    type: 'Veg', 
    color: 'bg-indigo-600',
    menu: [
      { id: 101, name: 'Mini Sambar Idli', price: 120, desc: 'Soft idlis soaked in savory sambar.', type: 'Veg' },
      { id: 102, name: 'Paneer Butter Masala', price: 210, desc: 'Creamy paneer curry with soft butter naan.', type: 'Veg' },
      { id: 103, name: 'Ghee Roast Dosa', price: 100, desc: 'Crispy dosa roasted in ghee.', type: 'Veg' },
    ]
  },
  { 
    id: 2, 
    name: 'Chicken Biryani Special', 
    subTitle: 'Al Faisal Biryani House',
    rating: 4.5, 
    time: '25-35 mins', 
    type: 'Non-Veg', 
    color: 'bg-red-700',
    menu: [
      { id: 201, name: 'Chicken Biryani', price: 280, desc: 'Classic Ambur style biryani, served with raita.', type: 'Non-Veg' },
      { id: 202, name: 'Mutton Chukka', price: 350, desc: 'Spicy dry mutton fry.', type: 'Non-Veg' },
      { id: 203, name: 'Gobi 65', price: 150, desc: 'Crispy fried cauliflower starter.', type: 'Veg' },
    ]
  },
  { 
    id: 3, 
    name: 'North Indian Eats', 
    subTitle: 'Modern Chapati & Grills',
    rating: 4.2, 
    time: '30-40 mins', 
    type: 'Veg', 
    color: 'bg-teal-600',
    menu: [
      { id: 301, name: 'Tandoori Chicken', price: 450, desc: 'Marinated chicken grilled in a tandoor.', type: 'Non-Veg' }, 
      { id: 302, name: 'Paneer Tikka Masala', price: 240, desc: 'Smoked paneer in a rich tomato gravy.', type: 'Veg' },
      { id: 303, name: 'Butter Naan', price: 60, desc: 'Soft, buttery leavened bread.', type: 'Veg' },
    ]
  },
  { 
    id: 4, 
    name: 'Shawarma Wraps', 
    subTitle: 'Global Shawarma Spot',
    rating: 4.6, 
    time: '25-35 mins', 
    type: 'Non-Veg', 
    color: 'bg-orange-500',
    menu: [
      { id: 401, name: 'Chicken Shawarma Roll', price: 200, desc: 'Classic chicken shawarma with garlic sauce.', type: 'Non-Veg' },
      { id: 402, name: 'Falafel Wrap', price: 180, desc: 'Crispy falafel with hummus and fresh veggies.', type: 'Veg' },
      { id: 403, name: 'Mixed Grill Platter', price: 400, desc: 'Assortment of grilled meats.', type: 'Non-Veg' },
    ]
  },
];

const UPI_APPS = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'];
const DELIVERY_FEE = 30;
const PLATFORM_FEE = 5; // Platform Fee added
const GST_RATE = 0.05; // 5% GST on Subtotal

// --- REDUX SIMULATION: CONTEXT AND REDUCER ---

// 1. Initial State
const initialState = {
  cart: [],
  address: 'Plot No 1, Main Street, T. Nagar, Chennai - 600017, Tamil Nadu, India.', 
  orderStatus: 'home', // 'home', 'menu', 'cart', 'checkout', 'success'
  selectedRestaurant: null,
  priceDetails: { subtotal: 0, delivery: 0, platform: 0, gst: 0, total: 0 },
};

// Utility function to calculate all price components
const calculateTotal = (cart) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  if (subtotal === 0) {
      return { subtotal: 0, delivery: 0, platform: 0, gst: 0, total: 0 };
  }
  
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const platform = PLATFORM_FEE;
  const gst = subtotal * GST_RATE; // Calculate GST on the subtotal
  const total = subtotal + delivery + platform + gst;
  
  return { 
      subtotal: subtotal, 
      delivery: delivery, 
      platform: platform, 
      gst: parseFloat(gst.toFixed(2)), 
      total: parseFloat(total.toFixed(2)) 
  };
};

// 2. Reducer (State Transition Logic)
function appReducer(state, action) {
  let updatedCart;
  let newPriceDetails;

  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, orderStatus: action.payload };

    case 'SELECT_RESTAURANT':
        return { 
            ...state, 
            selectedRestaurant: action.payload, 
            orderStatus: 'menu',
            cart: [],
            priceDetails: calculateTotal([]), // Reset price details
        };

    case 'ADD_ITEM': {
      const { id } = action.payload;
      const existingItem = state.cart.find(item => item.id === id);
      
      if (existingItem) {
        updatedCart = state.cart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      newPriceDetails = calculateTotal(updatedCart);
      return { ...state, cart: updatedCart, priceDetails: newPriceDetails };
    }

    case 'UPDATE_QUANTITY': {
        const { id, quantity } = action.payload;
        
        if (quantity > 0) {
            updatedCart = state.cart.map(item =>
                item.id === id ? { ...item, quantity: quantity } : item
            );
        } else {
            updatedCart = state.cart.filter(item => item.id !== id);
        }
        newPriceDetails = calculateTotal(updatedCart);
        return { ...state, cart: updatedCart, priceDetails: newPriceDetails };
    }

    case 'UPDATE_ADDRESS':
      return { ...state, address: action.payload };

    case 'PLACE_ORDER':
      return { ...state, orderStatus: 'success' };

    case 'RESET_APP':
      return initialState;

    default:
      return state;
  }
}

// 3. Context
const AppContext = createContext();

// 4. Provider (Wrapper component)
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 5. Custom Hook for easy access
const useAppContext = () => useContext(AppContext);

// --- UTILITY COMPONENTS ---

// GPS Address Manager Component
const AddressManager = () => {
    const { state, dispatch } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddressInput, setShowAddressInput] = useState(false);

    const simulateGPSUpdate = () => {
        setIsLoading(true);
        setError(null);
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude.toFixed(4);
                    const lon = position.coords.longitude.toFixed(4);
                    const newAddress = `[GPS Location] Lat: ${lat}, Lon: ${lon} - Near Chennai Area`;
                    
                    dispatch({ type: 'UPDATE_ADDRESS', payload: newAddress });
                    setIsLoading(false);
                },
                (err) => {
                    setError(`Error accessing location: ${err.message}. Please enter manually.`);
                    setIsLoading(false);
                },
                { timeout: 10000 }
            );
        } else {
            setError("Geolocation not supported by your device. Please enter manually.");
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-800">Delivering to:</p>
              <button 
                onClick={() => setShowAddressInput(!showAddressInput)}
                className="text-indigo-600 text-sm hover:underline"
              >
                {showAddressInput ? 'Hide Input' : 'Change'}
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-3">{state.address}</p>
            
            {showAddressInput && (
              <>
                <textarea
                    value={state.address}
                    onChange={(e) => dispatch({ type: 'UPDATE_ADDRESS', payload: e.target.value })}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-3"
                    placeholder="Enter your delivery address"
                ></textarea>
                <button
                    onClick={simulateGPSUpdate}
                    disabled={isLoading}
                    className={`mt-1 w-full py-2 text-white font-semibold rounded-lg text-sm transition ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {isLoading ? 'Fetching Location...' : 'Use Current GPS Location'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </>
            )}
        </div>
    );
};

// --- SCREENS ---

// Screen 1: Home/Restaurant Selection
const HomeScreen = () => {
  const { state, dispatch } = useAppContext();
  const [filter, setFilter] = useState('All'); // 'All', 'Veg', 'Non-Veg'
  
  const filteredRestaurants = restaurantData.filter(res => 
    filter === 'All' || res.type === filter
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Address Manager at the top */}
      <AddressManager />

      {/* Offers Section (FINAL VISUAL STYLE) */}
      <div className="mb-8 p-4 pt-0 bg-white rounded-xl shadow-lg"> 
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top Offers For You</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"> 
            
            {/* Offer 1: FLAT ₹50 OFF */}
            <div className="flex-none w-48 bg-blue-100 p-2 rounded-lg border border-blue-300 text-center text-sm">
                <p className="text-red-600 text-base font-bold">🎉 FLAT ₹50 OFF</p>
                <p className="text-xs text-gray-700 font-medium">On orders above ₹199</p>
            </div>

            {/* Offer 2: 20% INSTANT DISCOUNT */}
            <div className="flex-none w-48 bg-blue-100 p-2 rounded-lg border border-blue-300 text-center text-sm">
                <p className="text-blue-600 text-base font-bold">💳 20% INSTANT DISCOUNT</p>
                <p className="text-xs text-gray-700 font-medium">For HDFC Card Users</p>
            </div>
            
            {/* Offer 3: FREE DELIVERY */}
            <div className="flex-none w-48 bg-green-100 p-2 rounded-lg border border-green-300 text-center text-sm">
                <p className="text-green-600 text-base font-bold">🚚 FREE DELIVERY</p>
                <p className="text-xs text-gray-700 font-medium">On your first 3 orders</p>
             </div>
             
             {/* Offer 4: SUPER SAVINGS (Added extra for overflow effect) */}
             <div className="flex-none w-48 bg-yellow-100 p-2 rounded-lg border border-yellow-300 text-center text-sm">
                <p className="text-yellow-700 text-base font-bold">⚡ SUPER SAVINGS</p>
                <p className="text-xs text-gray-700 font-medium">Up to ₹100 on selected items</p>
            </div>
        </div>
      </div>


      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 mt-8">Filtered Restaurants ({filteredRestaurants.length})</h2>
      
      {/* Veg/Non-Veg Filters (from your screenshot) */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setFilter('All')}
          className={`py-2 px-6 rounded-full font-semibold transition ${
            filter === 'All'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Veg')}
          className={`py-2 px-6 rounded-full font-semibold transition ${
            filter === 'Veg'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Veg
        </button>
        <button
          onClick={() => setFilter('Non-Veg')}
          className={`py-2 px-6 rounded-full font-semibold transition ${
            filter === 'Non-Veg'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Non-Veg
        </button>
      </div>

      {/* Restaurant List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map(res => (
          <div 
            key={res.id} 
            onClick={() => dispatch({ type: 'SELECT_RESTAURANT', payload: res })}
            className="bg-white p-0 rounded-xl shadow-lg border border-gray-200 cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
          >
            {/* Colored Top Banner */}
            <div className={`p-4 h-24 flex items-center justify-center ${res.color}`}>
                <h3 className="text-2xl font-bold text-white text-shadow-lg">{res.name}</h3>
            </div>

            <div className="p-4 pt-2">
                <p className="text-sm text-gray-500 mb-3">{res.subTitle}</p>
                
                {/* Rating and Time */}
                <div className="flex justify-between items-center text-sm font-medium mb-3">
                    <div className="flex items-center text-green-600 bg-green-50 p-1 rounded">
                        {/* Star Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span className="ml-1 font-bold">{res.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        {/* Clock Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span className="ml-1">{res.time}</span>
                    </div>
                </div>

                <button 
                    className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2"
                >
                    {/* Menu Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    <span>View Menu</span>
                </button>
            </div>
          </div>
        ))}
        {filteredRestaurants.length === 0 && (
            <p className="col-span-full text-center text-gray-500 p-8 border border-dashed rounded-lg">No restaurants matching your filter criteria.</p>
        )}
      </div>
    </div>
  );
};

// Screen 2: Menu Items
const MenuScreen = () => {
    const { state, dispatch } = useAppContext();
    const [itemFilter, setItemFilter] = useState('All'); // 'All', 'Veg', 'Non-Veg'
    const restaurant = state.selectedRestaurant;

    if (!restaurant) {
        useEffect(() => { dispatch({ type: 'SET_SCREEN', payload: 'home' }); }, [dispatch]);
        return null; 
    }

    const filteredMenu = restaurant.menu.filter(item => 
        itemFilter === 'All' || item.type === itemFilter
    );

    const handleAddToCart = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const cartItemCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="p-4 sm:p-6">
            <button 
                onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}
                className="text-indigo-600 hover:underline mb-4 flex items-center"
            >
                {/* Arrow Left Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back to Restaurants
            </button>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{restaurant.name} Menu</h2>
            <p className="text-lg font-semibold text-gray-600 mb-6 flex items-center">
                <span className="flex items-center text-green-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span className="ml-1">{restaurant.rating}</span>
                </span>
                <span className="text-red-500">{restaurant.time} Delivery</span>
            </p>

            {/* Item Filters */}
            <div className="flex space-x-3 mb-8">
                {['All', 'Veg', 'Non-Veg'].map(f => (
                    <button
                        key={f}
                        onClick={() => setItemFilter(f)}
                        className={`py-2 px-4 rounded-full font-semibold transition ${
                        itemFilter === f
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Menu Items List */}
            <div className="space-y-6">
                {filteredMenu.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-lg flex justify-between items-center">
                        <div className="flex-1 pr-4">
                            <span className={`text-sm font-bold ${item.type === 'Veg' ? 'text-green-600' : 'text-red-600'}`}>
                                {item.type === 'Veg' ? '🌱 Veg' : '🍗 Non-Veg'}
                            </span>
                            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                            <p className="text-xl font-extrabold text-indigo-600 mt-1">₹{item.price}</p>
                        </div>
                        <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-105"
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>

            {/* Cart button visible when items are added */}
            {cartItemCount > 0 && (
                <div className="fixed bottom-4 left-0 right-0 p-4 flex justify-center z-50">
                    <button
                        onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'cart' })}
                        className="w-full max-w-sm bg-red-600 text-white text-lg font-bold py-3 px-6 rounded-full shadow-2xl transform hover:scale-[1.02] transition duration-200 flex items-center justify-center space-x-2"
                    >
                        {/* Cart Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6"/></svg>
                        <span>View Cart ({cartItemCount}) - ₹{state.priceDetails.total.toFixed(2)}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

// Screen 3: Cart Screen
const CartScreen = () => {
    const { state, dispatch } = useAppContext();
    const { subtotal, delivery, platform, gst, total } = state.priceDetails;

    const handleQuantityChange = (id, newQuantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: parseInt(newQuantity) } });
    };

    if (state.cart.length === 0) {
        return (
            <div className="p-6 text-center max-w-lg mx-auto bg-white rounded-xl shadow-lg mt-10">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty!</h2>
                <button
                    onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                >
                    Go Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Order Summary from {state.selectedRestaurant.name}</h2>

            {/* Cart Items List */}
            <div className="space-y-4 mb-8">
                {state.cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">₹{item.price} per item</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300 transition"
                                disabled={item.quantity === 1}
                            >
                                {/* Minus Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                            >
                                {/* Plus Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-2">
                <div className="flex justify-between font-medium text-gray-700">
                    <p>Subtotal:</p>
                    <p>₹{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-medium text-gray-700">
                    <p>Delivery Fee:</p>
                    <p>₹{delivery.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-medium text-gray-700">
                    <p>Platform Fee:</p>
                    <p>₹{platform.toFixed(2)}</p>
                </div>
                 <div className="flex justify-between font-medium text-gray-700 border-b border-gray-200 pb-2">
                    <p>GST and Restaurant Taxes (5%):</p>
                    <p>₹{gst.toFixed(2)}</p>
                </div>
                <div className="flex justify-between pt-3 font-extrabold text-xl text-green-600">
                    <p>Total Payable:</p>
                    <p>₹{total.toFixed(2)}</p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 space-y-3">
                <button
                    onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'checkout' })}
                    className="w-full bg-red-600 text-white text-lg font-bold py-3 rounded-xl shadow-lg hover:bg-red-700 transition"
                >
                    Proceed to Checkout
                </button>
                <button
                    onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}
                    className="w-full bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

// Screen 4: Checkout Screen (with Payment Options and GPS Address)
const CheckoutScreen = () => {
  const { state, dispatch } = useAppContext();
  const { subtotal, delivery, platform, gst, total } = state.priceDetails;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState(UPI_APPS[0]);
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [wallet, setWallet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple form validation check
  const isFormValid = () => {
    if (!state.address || state.address.length < 10) return false;
    return true;
  };

  const handlePlaceOrder = () => {
    if (!isFormValid() || isProcessing) return;

    setIsProcessing(true);

    // Simulate a payment/API call delay
    setTimeout(() => {
        dispatch({ type: 'PLACE_ORDER' });
        setIsProcessing(false);
    }, 1500);
  };

  // Payment Method Renders
  const renderPaymentDetails = () => {
    switch (paymentMethod) {
      case 'upi':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Select UPI App</h3>
            <div className="grid grid-cols-2 gap-3">
                {UPI_APPS.map(app => (
                    <button 
                        key={app}
                        onClick={() => setUpiApp(app)}
                        className={`p-3 border rounded-lg transition text-sm font-medium ${upiApp === app ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-white hover:bg-gray-50'}`}
                    >
                        {app}
                    </button>
                ))}
            </div>
            <input 
                type="text" 
                placeholder="Enter UPI ID (e.g., user@bank)"
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        );
      case 'card':
        return (
          <div className="space-y-3">
            <input 
                type="text" 
                placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                maxLength="19"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input 
                type="text" 
                placeholder="Cardholder Name"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <div className="flex space-x-3">
              <input 
                  type="text" 
                  placeholder="Expiry (MM/YY)"
                  maxLength="5"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg"
              />
              <input 
                  type="password" 
                  placeholder="CVV"
                  maxLength="4"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-700">Select Digital Wallet</h3>
            <select 
                value={wallet} 
                onChange={(e) => setWallet(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"
            >
                <option value="">Select a Wallet</option>
                <option value="MobiKwik">MobiKwik</option>
                <option value="Ola Money">Ola Money</option>
                <option value="JioMoney">JioMoney</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">You will be redirected to the wallet's payment gateway.</p>
          </div>
        );
      case 'cod':
        return (
          <p className="p-3 bg-indigo-100 text-indigo-700 rounded-lg font-medium border border-indigo-200">
            Cash on Delivery (COD) selected. Please keep exact change ready.
          </p>
        );
      default:
        return null;
    }
  };

  if (state.cart.length === 0) {
    useEffect(() => { dispatch({ type: 'SET_SCREEN', payload: 'menu' }); }, [dispatch]);
    return null;
  }
  
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">Final Checkout</h2>

      {/* Delivery Address - Already Handled by AddressManager in Home */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">1. Delivery Address</h3>
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <p className="font-semibold text-gray-800">Current Address:</p>
        <p className="text-sm text-gray-700 mt-1">{state.address}</p>
        <p className="text-xs text-gray-500 mt-2">To change the address, please go back to the Home screen.</p>
      </div>


      {/* Payment Method Selection */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">2. Payment Method</h3>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {['upi', 'card', 'wallet', 'cod'].map(method => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`py-2 px-4 rounded-full font-semibold whitespace-nowrap transition ${
              paymentMethod === method
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {method.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Payment Details Form */}
      <div className="bg-white p-5 rounded-xl shadow-lg mb-8">
        {renderPaymentDetails()}
      </div>
      
      {/* Price Summary */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-2 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">Price Details</h3>
          <div className="flex justify-between font-medium text-gray-700">
              <p>Subtotal:</p>
              <p>₹{subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-medium text-gray-700">
              <p>Delivery Fee:</p>
              <p>₹{delivery.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-medium text-gray-700">
              <p>Platform Fee:</p>
              <p>₹{platform.toFixed(2)}</p>
          </div>
           <div className="flex justify-between font-medium text-gray-700 border-b border-gray-200 pb-2">
              <p>GST and Restaurant Taxes (5%):</p>
              <p>₹{gst.toFixed(2)}</p>
          </div>
          <div className="flex justify-between pt-3 font-extrabold text-xl text-green-600">
              <p>Total Payable:</p>
              <p>₹{total.toFixed(2)}</p>
          </div>
      </div>
      
      <button
        onClick={handlePlaceOrder}
        disabled={!isFormValid() || isProcessing}
        className={`w-full text-white text-xl font-bold py-4 rounded-xl shadow-2xl transition ${
          isFormValid() && !isProcessing
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isProcessing ? 'Processing Payment...' : 'Place Order Now'}
      </button>
      <button
        onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'cart' })}
        className="w-full mt-3 text-sm text-red-600 hover:underline"
      >
        &larr; Back to Cart
      </button>
    </div>
  );
};

// Screen 5: Order Success Screen (Shows ONLY "Successful")
const SuccessScreen = () => {
    const { dispatch } = useAppContext();
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        // Start a countdown to automatically go back to the menu
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Auto redirect after countdown
            dispatch({ type: 'RESET_APP' });
        }
    }, [seconds, dispatch]);


    const handleNewOrder = () => {
        dispatch({ type: 'RESET_APP' });
    };

    return (
        <div className="p-6 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-green-500 mb-6">
                {/* Checkmark Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.87-8.91"/><path d="m15 4 2 2 4-4"/></svg>
            </div>
            <h2 className="text-5xl font-extrabold text-green-600 mb-8">Successful</h2>
            <button
                onClick={handleNewOrder}
                className="bg-indigo-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transition"
            >
                Start New Order
            </button>
            <p className="text-gray-500 text-sm mt-4">Returning to Home screen in {seconds} seconds...</p>
        </div>
    );
};


// --- MAIN APP COMPONENT (Router) ---
const App = () => {
    const { state, dispatch } = useAppContext();

    // Render the screen based on the global orderStatus state
    const renderScreen = () => {
        switch (state.orderStatus) {
            case 'menu':
                return <MenuScreen />;
            case 'cart':
                return <CartScreen />;
            case 'checkout':
                return <CheckoutScreen />;
            case 'success':
                return <SuccessScreen />;
            case 'home':
            default:
                return <HomeScreen />;
        }
    };

    const Header = () => {
        const cartItemCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

        return (
            <header className="bg-white shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
                    <h1 
                        className="text-2xl font-extrabold text-indigo-600 cursor-pointer"
                        onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}
                    >
                        Swift Dine App
                    </h1>
                    <nav className="text-sm font-medium space-x-4 flex items-center">
                        <button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })} className="text-gray-600 hover:text-indigo-600">Home</button>
                        {cartItemCount > 0 && (
                            <button 
                                onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'cart' })} 
                                className="text-red-600 flex items-center hover:text-red-700 p-2 rounded-lg bg-red-50"
                            >
                                {/* Cart Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6"/></svg>
                                Cart ({cartItemCount})
                            </button>
                        )}
                    </nav>
                </div>
            </header>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderScreen()}
            </main>
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Set the font globally using inline style for simplicity in single file */}
            <style jsx="true">
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                    body {
                        font-family: 'Inter', sans-serif;
                    }
                    /* Custom shadow for the colored titles to stand out against the colored background */
                    .text-shadow-lg {
                        text-shadow: 0 0px 4px rgba(0, 0, 0, 0.4);
                    }
                `}
            </style>
        </div>
    );
};

// Wrap the main App component with the Context Provider
const WrappedApp = () => {
    // Basic Error Boundary
    try {
        return (
            <AppProvider>
                <App />
            </AppProvider>
        );
    } catch (e) {
        console.error("Critical Render Error:", e);
        return (
            <div className="p-10 text-center bg-red-100 text-red-800">
                <h1>CRITICAL ERROR</h1>
                <p>The application failed to render. Please check the browser console for details on the error.</p>
            </div>
        );
    }
};

export default WrappedApp;