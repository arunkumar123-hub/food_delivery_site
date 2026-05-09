import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import { useState } from 'react'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/PlaceOrder/verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import VerifyEmail from './components/LoginPopup/verifyemail/VerifyEmail'


const App = () => {
  const [showLogin,setShowLogin]=useState(false);
  return (
    <>
  
    {showLogin? <LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order'element={<PlaceOrder/>}/>
        <Route path='/verify'element={<Verify/>}/>
        <Route path='/myorders'element={<MyOrders/>}/>
        <Route path='/verify-email'element={<VerifyEmail/>}/>
      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App
