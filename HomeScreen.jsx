import React, { useState } from 'react';
import { useAppContext } from '../StateContext';

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
                    const newAddress = `[GPS Location] Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)} - Near Chennai Area`;
                    dispatch({ type: 'UPDATE_ADDRESS', payload: newAddress });
                    setIsLoading(false);
                },
                (err) => { setError(`Error accessing location: ${err.message}. Please enter manually.`); setIsLoading(false); },
                { timeout: 10000 }
            );
        } else { setError("Geolocation not supported. Please enter manually."); setIsLoading(false); }
    };

    return (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-800">Delivering to:</p>
              <button onClick={() => setShowAddressInput(!showAddressInput)} className="text-indigo-600 text-sm hover:underline">{showAddressInput ? 'Hide Input' : 'Change'}</button>
            </div>
            <p className="text-sm text-gray-700 mb-3">{state.address}</p>
            
            {showAddressInput && (
              <>
                <textarea value={state.address} onChange={(e) => dispatch({ type: 'UPDATE_ADDRESS', payload: e.target.value })} rows="3" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-3" placeholder="Enter your delivery address"></textarea>
                <button onClick={simulateGPSUpdate} disabled={isLoading} className={`mt-1 w-full py-2 text-white font-semibold rounded-lg text-sm transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {isLoading ? 'Fetching Location...' : 'Use Current GPS Location'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </>
            )}
        </div>
    );
};

const HomeScreen = () => {
  const { state, dispatch } = useAppContext();
  const [filter, setFilter] = useState('All'); 
  
  const filteredRestaurants = state.restaurants.filter(res => 
    filter === 'All' || res.type === filter
  );

  return (
    <div className="p-4 sm:p-6">
      <AddressManager />

      {/* Offers Section */}
      <div className="mb-8 p-4 pt-0 bg-white rounded-xl shadow-lg"> 
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top Offers For You</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"> 
            <div className="flex-none w-48 bg-blue-100 p-2 rounded-lg border border-blue-300 text-center text-sm"><p className="text-red-600 text-base font-bold">🎉 FLAT ₹50 OFF</p><p className="text-xs text-gray-700 font-medium">On orders above ₹199</p></div>
            <div className="flex-none w-48 bg-blue-100 p-2 rounded-lg border border-blue-300 text-center text-sm"><p className="text-blue-600 text-base font-bold">💳 20% INSTANT DISCOUNT</p><p className="text-xs text-gray-700 font-medium">For HDFC Card Users</p></div>
            <div className="flex-none w-48 bg-green-100 p-2 rounded-lg border border-green-300 text-center text-sm"><p className="text-green-600 text-base font-bold">🚚 FREE DELIVERY</p><p className="text-xs text-gray-700 font-medium">On your first 3 orders</p></div>
            <div className="flex-none w-48 bg-yellow-100 p-2 rounded-lg border border-yellow-300 text-center text-sm"><p className="text-yellow-700 text-base font-bold">⚡ SUPER SAVINGS</p><p className="text-xs text-gray-700 font-medium">Up to ₹100 on selected items</p></div>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 mt-8">Filtered Restaurants ({filteredRestaurants.length})</h2>
      
      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-8">
        {['All', 'Veg', 'Non-Veg'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`py-2 px-6 rounded-full font-semibold transition ${filter === f ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{f}</button>))}
      </div>

      {/* Restaurant List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map(res => (
          <div key={res.id} onClick={() => dispatch({ type: 'SELECT_RESTAURANT', payload: res })} className="bg-white p-0 rounded-xl shadow-lg border border-gray-200 cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden">
            <div className={`p-4 h-24 flex items-center justify-center ${res.color}`}><h3 className="text-2xl font-bold text-white text-shadow-lg">{res.name}</h3></div>
            <div className="p-4 pt-2">
                <p className="text-sm text-gray-500 mb-3">{res.subTitle}</p>
                <div className="flex justify-between items-center text-sm font-medium mb-3">
                    <div className="flex items-center text-green-600 bg-green-50 p-1 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span className="ml-1 font-bold">{res.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span className="ml-1">{res.time}</span></div>
                </div>
                <button className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg><span>View Menu</span>
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HomeScreen;