import React, { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import AddItems from './components/AddItems'
import List from './components/List'
import Order from './components/Order'
import Navbar from './components/Navbar'
import AdminLogin from './components/AdminLogin'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'))

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<AddItems />} />
        <Route path='/add' element={<AddItems />} />
        <Route path='/list' element={<List />} />
        <Route path='/orders' element={<Order />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  )
}

export default App
