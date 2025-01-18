import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpService } from '../services/userService'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'


function SignupComp() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const {auth} = useAuth()

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log({ name, phone, email, password });
    const response = await signUpService(name, phone, email, password);
    if(response.success){
       toast.success("Successfully registed!!");
       navigate('/')
    }
  }

  useEffect(() => {
        if(auth.isLoggedIn){
          navigate('/dashboard', {replace:true})
        }
      },[])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8  rounded-lg shadow-lg w-full max-w-sm">
        <h1 className='text-4xl font-atma text-blue-500 text-center justify-center'>Let's Shop</h1>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Enter Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input 
            type="text" 
            placeholder="Enter Phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input 
            type="email" 
            placeholder="Enter Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Sign Up
          </button>
           <h1 className='hover:text-blue-500 text-center cursor-pointer'
           onClick={() => navigate('/')}>Already user ? SignIn</h1>
        </form>
      </div>
    </div>
  )
}

export default SignupComp
