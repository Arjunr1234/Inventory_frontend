import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import SignIn from './pages/SignIn';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Layout from './components/Layout';
import Customers from './components/Customers';
import Products from './components/Products';
import Sales from './components/Sales';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import NotFound from './components/NotFound';
import Reports from './components/Reports';


function App() {
  

  return (
   
    <>
      <Routes>
        
        <Route path='/' element={<SignIn/>}/>
        <Route path='/signup' element={<Signup/>} />
        <Route element={<ProtectedRoute />}>
        <Route element={<Layout/>}>
           <Route path='/dashboard' element={<Dashboard/>}/>
           <Route path='customers' element={<Customers/>}/>
           <Route path='products' element={<Products/>}/>
           <Route path='sales' element={<Sales/>}/>
           <Route path='report' element={<Reports/>} />
        </Route>
        </Route>
       <Route path='*' element={<NotFound/>} />
      </Routes>
    </>
  )
}

export default App
