import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home'; 
import ContactPage from './pages/ContactPage/ContactPage';
import AboutPage from './pages/AboutPage/AboutPage';
import Menu from './pages/Menu/Menu';
import CartPage from './pages/Cart/Cart';
import SignUp from './components/SignUp/signUp';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import MyOrderPage from './pages/MyOrderPage/MyOrderPage';
import Login from './components/Login/Login'; // Add this import
import ThankYou from './pages/ThankYou/ThankYou';
import Cart from './components/Cart/Cart';
import { CartProvider } from './CartContext/CartContext';

const App = () => {
  return (
    <CartProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/login' element={<Login />} /> {/* FIXED */}
        <Route path='/signup' element={<SignUp /> }/>

        <Route path='/myorder/verify' element={<VerifyPaymentPage />} />

            <Route path='/cart' element={
              <PrivateRoute> 
                <CartPage /> 
              </PrivateRoute>}  />


              <Route path='/checkout' element={
                < PrivateRoute> 
                  <CheckoutPage />
                </PrivateRoute> }/>



        <Route path='/myorder' element={ <PrivateRoute> < MyOrderPage /> </PrivateRoute> } />
        <Route path="/cart" element={<Cart />} />
        <Route path="/thankyou" element={<ThankYou />} />
            
      </Routes>
    </CartProvider>
  );
};

export default App;
