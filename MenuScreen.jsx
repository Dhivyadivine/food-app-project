import React, { useState, useEffect } from 'react';
import { useAppContext } from '../StateContext';

// Utility component (for price display in cart/checkout)
const PriceSummary = ({ priceDetails }) => {
    const { subtotal, delivery, platform, gst, total } = priceDetails;
    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-2 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">Price Details</h3>
            <div className="flex justify-between font-medium text-gray-700"><p>Subtotal:</p><p>₹{subtotal.toFixed(2)}</p></div>
            <div className="flex justify-between font-medium text-gray-700"><p>Delivery Fee:</p><p>₹{delivery.toFixed(2)}</p></div>
            <div className="flex justify-between font-medium text-gray-700"><p>Platform Fee:</p><p>₹{platform.toFixed(2)}</p></div>
            <div className="flex justify-between font-medium text-gray-700 border-b border-gray-200 pb-2"><p>GST and Restaurant Taxes (5%):</p><p>₹{gst.toFixed(2)}</p></div>
            <div className="flex justify-between pt-3 font-extrabold text-xl text-green-600"><p>Total Payable:</p><p>₹{total.toFixed(2)}</p></div>
        </div>
    );
};

// Cart Display Component (Renders Cart Items and Summary)
const CartDisplay = () => {
    const { state, dispatch } = useAppContext();
    const handleQuantityChange = (id, newQuantity) => { dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: parseInt(newQuantity) } }); };

    if (state.cart.length === 0) {
        return (<div className="p-6 text-center max-w-lg mx-auto bg-white rounded-xl shadow-lg mt-10"><h2 className="text-2xl font-bold mb-4">Your Cart is Empty!</h2><button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })} className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">Go Back to Menu</button></div>);
    }

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Order Summary from {state.selectedRestaurant.name}</h2>
            <div className="space-y-4 mb-8">
                {state.cart.map(item => (<div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
                        <div className="flex-1"><p className="font-semibold text-gray-800">{item.name}</p><p className="text-sm text-gray-500">₹{item.price} per item</p></div>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300 transition" disabled={item.quantity === 1}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                            </button>
                        </div>
                    </div>))}
            </div>
            <PriceSummary priceDetails={state.priceDetails} />
            <div className="mt-8 space-y-3">
                <button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'checkout' })} className="w-full bg-red-600 text-white text-lg font-bold py-3 rounded-xl shadow-lg hover:bg-red-700 transition">Proceed to Checkout</button>
                <button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-300 transition">Continue Shopping</button>
            </div>
        </div>
    );
};

// Menu Items Display
const MenuDisplay = () => {
    const { state, dispatch } = useAppContext();
    const [itemFilter, setItemFilter] = useState('All'); 
    const restaurant = state.selectedRestaurant;

    const filteredMenu = restaurant.menu.filter(item => itemFilter === 'All' || item.type === itemFilter);
    const handleAddToCart = (item) => { dispatch({ type: 'ADD_ITEM', payload: item }); };
    const cartItemCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="p-4 sm:p-6">
            <button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })} className="text-indigo-600 hover:underline mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>Back to Restaurants
            </button>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{restaurant.name} Menu</h2>
            <p className="text-lg font-semibold text-gray-600 mb-6 flex items-center">
                <span className="flex items-center text-green-600 mr-4"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span className="ml-1">{restaurant.rating}</span></span>
                <span className="text-red-500">{restaurant.time} Delivery</span>
            </p>
            <div className="flex space-x-3 mb-8">
                {['All', 'Veg', 'Non-Veg'].map(f => (<button key={f} onClick={() => setItemFilter(f)} className={`py-2 px-4 rounded-full font-semibold transition ${itemFilter === f ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{f}</button>))}
            </div>

            <div className="space-y-6">
                {filteredMenu.map(item => (<div key={item.id} className="bg-white p-4 rounded-xl shadow-lg flex justify-between items-center">
                        <div className="flex-1 pr-4"><span className={`text-sm font-bold ${item.type === 'Veg' ? 'text-green-600' : 'text-red-600'}`}>{item.type === 'Veg' ? '🌱 Veg' : '🍗 Non-Veg'}</span>
                            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3><p className="text-sm text-gray-500">{item.desc}</p>
                            <p className="text-xl font-extrabold text-indigo-600 mt-1">₹{item.price}</p>
                        </div>
                        <button onClick={() => handleAddToCart(item)} className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-105">Add</button>
                    </div>))}
            </div>

            {cartItemCount > 0 && (
                <div className="fixed bottom-4 left-0 right-0 p-4 flex justify-center z-50">
                    <button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'cart' })} className="w-full max-w-sm bg-red-600 text-white text-lg font-bold py-3 px-6 rounded-full shadow-2xl transform hover:scale-[1.02] transition duration-200 flex items-center justify-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6"/></svg>
                        <span>View Cart ({cartItemCount}) - ₹{state.priceDetails.total.toFixed(2)}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

// Main Screen Component (Routes internally between Menu and Cart)
const MenuScreen = () => {
    const { state } = useAppContext();
    if (!state.selectedRestaurant) return <div className="text-center p-10">No Restaurant Selected.</div>;
    
    if (state.orderStatus === 'cart') {
        return <CartDisplay />;
    } else {
        return <MenuDisplay />;
    }
}
export default MenuScreen;