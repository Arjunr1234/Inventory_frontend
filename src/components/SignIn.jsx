import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { signInService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

function SignInComp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {auth, login} = useAuth();

    
    useEffect(() => {
      if(auth.isLoggedIn){
        navigate('/dashboard', {replace:true})
      }
    },[])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
          const response = await signInService(email, password);
       if(response.success){
          toast.success("Login Successfull!!");
          login(response.userId);
          navigate('/dashboard');

       }  
          
        } catch (error) {
           console.log("Error in handleSubmin: ", error)
           toast.error(error.response.data.message)
        }
      

    }

   

  return (
    
    <>
       <div className=' flex min-h-screen justify-center items-center bg-gray-200'>
           <div className='max-w-sm p-8 bg-white w-full rounded-md'>
              <h1 className='text-4xl font-atma text-blue-500 text-center justify-center'>Let's Shop</h1>
              <h2 className='text-4xl font-semibold font-mono text-center p-4'>Login</h2>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <input type="email"
                 placeholder='Enter email..'
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className='w-full p-3 border border-gray-300 rounded-md  focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                  <input type="password"
                 placeholder='Enter password..'
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className='w-full p-3 border border-gray-300 rounded-md  focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                  <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Login
               </button>
                </form>
                <h1 className='p-4 hover:text-blue-400 text-center text-black '
                onClick={() => navigate('/signup')}>Not a current User ? Signup</h1>
           </div>
        </div> 
    </>
  )
}

export default SignInComp
