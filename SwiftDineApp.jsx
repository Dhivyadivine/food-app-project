import React, { useState, useEffect } from 'react';
import { useAppContext } from '../StateContext';

const UPI_APPS = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'];

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

const CheckoutScreen = () => {
  const { state, dispatch } = useAppContext();
  const { total } = state.priceDetails;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState(UPI_APPS[0]);
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [wallet, setWallet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isFormValid = () => { return !state.address || state.address.length < 10 ? false : true; };

  const handlePlaceOrder = () => {
    if (!isFormValid() || isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => { dispatch({ type: 'PLACE_ORDER' }); setIsProcessing(false); }, 1500);
  };

  const renderPaymentDetails = () => {
    switch (paymentMethod) {
      case 'upi': return (<div className="space-y-4"><h3 className="font-bold text-gray-700">Select UPI App</h3><div className="grid grid-cols-2 gap-3">{UPI_APPS.map(app => (<button key={app} onClick={() => setUpiApp(app)} className={`p-3 border rounded-lg transition text-sm font-medium ${upiApp === app ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-white hover:bg-gray-50'}`}>{app}</button>))}</div><input type="text" placeholder="Enter UPI ID (e.g., user@bank)" className="w-full p-3 border border-gray-300 rounded-lg"/></div>);
      case 'card': return (<div className="space-y-3"><input type="text" placeholder="Card Number (XXXX XXXX XXXX XXXX)" maxLength="19" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg"/><input type="text" placeholder="Cardholder Name" value={cardDetails.name} onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg"/><div className="flex space-x-3"><input type="text" placeholder="Expiry (MM/YY)" maxLength="5" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-1/2 p-3 border border-gray-300 rounded-lg"/><input type="password" placeholder="CVV" maxLength="4" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} className="w-1/2 p-3 border border-gray-300 rounded-lg"/></div></div>);
      case 'wallet': return (<div className="space-y-3"><h3 className="font-bold text-gray-700">Select Digital Wallet</h3><select value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option value="">Select a Wallet</option><option value="MobiKwik">MobiKwik</option><option value="Ola Money">Ola Money</option><option value="JioMoney">JioMoney</option></select><p className="text-sm text-gray-500 mt-2">You will be redirected to the wallet's payment gateway.</p></div>);
      case 'cod': return (<p className="p-3 bg-indigo-100 text-indigo-700 rounded-lg font-medium border border-indigo-200">Cash on Delivery (COD) selected. Please keep exact change ready.</p>);
      default: return null;
    }
  };

  if (state.cart.length === 0) { useEffect(() => { dispatch({ type: 'SET_SCREEN', payload: 'menu' }); }, [dispatch]); return null; }
  
  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">Final Checkout</h2>
      <h3 className="text-xl font-bold text-gray-800 mb-4">1. Delivery Address</h3>
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <p className="font-semibold text-gray-800">Current Address:</p>
        <p className="text-sm text-gray-700 mt-1">{state.address}</p>
        <p className="text-xs text-gray-500 mt-2">To change the address, please go back to the Home screen.</p>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">2. Payment Method</h3>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">{['upi', 'card', 'wallet', 'cod'].map(method => (<button key={method} onClick={() => setPaymentMethod(method)} className={`py-2 px-4 rounded-full font-semibold whitespace-nowrap transition ${paymentMethod === method ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{method.toUpperCase()}</button>))}</div>
      <div className="bg-white p-5 rounded-xl shadow-lg mb-8">{renderPaymentDetails()}</div>
      
      <PriceSummary priceDetails={state.priceDetails} />
      
      <button onClick={handlePlaceOrder} disabled={!isFormValid() || isProcessing} className={`w-full text-white text-xl font-bold py-4 rounded-xl shadow-2xl transition ${isFormValid() && !isProcessing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
        {isProcessing ? 'Processing Payment...' : 'Place Order Now'}
      </button>
      <button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'cart' })} className="w-full mt-3 text-sm text-red-600 hover:underline">&larr; Back to Cart</button>
    </div>
  );
};
export default CheckoutScreen;
