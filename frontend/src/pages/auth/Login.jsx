import React,{ useState,useContext } from 'react'
import {Link} from 'react-router-dom'
import {axiosInstance} from "../../utils/axiosInstance.js";
import toast from "react-hot-toast"
import {AppContext} from '../../context/AppContext.jsx'

const Login = () => {
    const {loading,setLoading,setUser,navigate} = useContext(AppContext)

    const [formData,setFormData] = useState({
        email:"",
        password:""
    });

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleSubmit=async(e)=>{
      e.preventDefault();
      try{
        setLoading(true)
        const {data} = await axiosInstance.post("/auth/login",formData);

        if(data.success) {
          toast.success(data.message)
          setUser(data.user)

           if(data.user.role === 'admin'){
            navigate("/admin/dashboard")
           } else{
            navigate("/student")
           }
        }

      }  catch(error) {
           toast.error(error.response.data.message)
      } finally{
        setLoading(false)
      }
    }
    
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 
    flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-6
      sm:p-8'>

        <div className='text-center mb-6'>
            <h2 className='text-2xl sm:text-3xl font-semibold text-gray-800'>Welcome Back</h2>
            <p className='text-sm text-gray-500 mt-1'>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <input type='email' value={formData.email} onChange={handleChange} name='email'
          placeholder='Email' className='h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none 
          focus:border-black'/>

          <input type='password' value={formData.password} onChange={handleChange} name='password'
          placeholder='Password' className='h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none 
          focus:border-black'/>

          <div className='flex justify-between items-center text-sm'>
             <Link to="/forgot-password" className='text-gray-600 hover:text-black\
             hover:underline'>Forgot Password?</Link>
          </div>

          <button type='submit' disabled={loading}
          className='mt-2 h-12 rounded-lg bg-black text-white font-semibold hover:opacity-90 transition '>
            {loading? "please wait.." : "Sign In"}
          </button>

        </form>

        <p className='text-center text-sm text-gray-600 mt-6'>
          Don't have an account?
          <Link to='/register' className='font-semibold text-black hover:underline'>Sign Up</Link>
        </p>
       
      </div>
    </div>
  )
}

export default Login
