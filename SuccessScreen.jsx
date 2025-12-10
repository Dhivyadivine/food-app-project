import React, { useState, useEffect } from 'react';
import { useAppContext } from '../StateContext';

const SuccessScreen = () => {
    const { dispatch } = useAppContext();
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        } else { dispatch({ type: 'RESET_APP' }); }
    }, [seconds, dispatch]);

    const handleNewOrder = () => { dispatch({ type: 'RESET_APP' }); };

    return (
        <div className="p-6 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-green-500 mb-6"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.87-8.91"/><path d="m15 4 2 2 4-4"/></svg></div>
            <h2 className="text-5xl font-extrabold text-green-600 mb-8">Successful</h2>
            <button onClick={handleNewOrder} className="bg-indigo-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transition">Start New Order</button>
            <p className="text-gray-500 text-sm mt-4">Returning to Home screen in {seconds} seconds...</p>
        </div>
    );
};
export default SuccessScreen;