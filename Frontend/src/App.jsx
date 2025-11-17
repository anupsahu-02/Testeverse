import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Account from './pages/Account'
import ShoppingCart from './pages/ShoppingCart'
import AddItemComponent from './pages/account-options/AddItem'
import MyItems from './pages/account-options/MyItems'

import UserProfile from './pages/account-options/Profile'
import UserOrders from './pages/account-options/Orders'
import MyAddress from './pages/account-options/MyAddress'

import Auth from './pages/Auth'

import UserProvider from './contexts/UserContext'

import SellerConfigForm from './pages/account-options/SellerConfigForm'
import Dashboard from './pages/account-options/Dashboard'
import Order from './pages/Order'

function App() {
    let [isPhone, setIsPhone] = useState(false);
    useEffect(() => {
        if(window.innerWidth <= 480) {
            setIsPhone(true);
        } else {
            setIsPhone(false)
        }
    }, [])

  return (
    <>
        <BrowserRouter>
            <UserProvider>
                <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/my-cart' element={<ShoppingCart />} />
                      {isPhone ? <Route path='/new-order' element={<Order />} /> : <></>}
                      <Route path='/auth' element={<Auth />} />
                      <Route path='account' element={<Account />} >
                          <Route path='/account/profile' element={<UserProfile />} />
                          <Route path='/account/orders' element={<UserOrders />} />
                          <Route path='/account/my-address' element={<MyAddress />} />
                          <Route path='/account/my-items' element={<MyItems />} />
                          <Route path='/account/add-item' element={<AddItemComponent />} />
                          <Route path='/account/dashboard' element={<Dashboard />} />
                          <Route path='/account/seller-config-form' element={<SellerConfigForm />} />
                      </Route>
                </Routes>
            </UserProvider >
        </BrowserRouter>
    </>
  )
}

export default App;
