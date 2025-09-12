import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { CartProvider } from './CartContext/CartContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
        <BrowserRouter>
 <App />
 </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
