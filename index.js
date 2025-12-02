import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App'; // This imports your clean App wrapper

const root = ReactDOM.createRoot(document.getElementById('root'));

// This renders the App component into the HTML page's 'root' div.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// NOTE: All previous import statements for './reportWebVitals' have been removed 
// to fix the "Module not found" error
