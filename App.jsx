import React from 'react';
import { useAppContext, AppProvider } from './StateContext'; // Import Context and Provider
import HomeScreen from './pages/HomeScreen';
import MenuScreen from './pages/MenuScreen';
import CheckoutScreen from './pages/CheckoutScreen';
import SuccessScreen from './pages/SuccessScreen';

const App = () => {
    const { state, dispatch } = useAppContext();

    // Headers are consistent across all non-success pages
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.58L23 6H6"/></svg>
                                Cart ({cartItemCount})
                            </button>
                        )}
                    </nav>
                </div>
            </header>
        );
    };

    // The internal Router using state.orderStatus
    const renderScreen = () => {
        switch (state.orderStatus) {
            case 'menu':
            case 'cart': 
                return <MenuScreen />; 
            case 'checkout':
                return <CheckoutScreen />;
            case 'success':
                return <SuccessScreen />;
            case 'home':
            default:
                return <HomeScreen />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderScreen()}
            </main>
        </div>
    );
};

// This wrapper provides the global state (AppProvider) to the App component.
const AppWrapper = () => (
    <AppProvider>
        <App />
    </AppProvider>
);

export default AppWrapper;
