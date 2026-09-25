import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { axiosInstance } from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const StudentTopbar = () => {
    const {navigate,setUser} = useContext(AppContext);

    const logout = async()=>{
        try{
            const {data} = await axiosInstance.get("/auth/logout");
            if(data.success) {
                toast.success(data.message)
                setUser(null)
                navigate('/login');
            }
        } catch(error) {
            toast.error(error.response.data.message)
        }
    }

  return (
    <div>
      <header className='bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center
      justify-between'>
        <div>
            <h2 className='text-xl font-semibold text-gray-800'>Student Dashboard</h2>
            <p className='text-sm text-gray-500'>Manage your library activities</p>
        </div>

        <button onClick = {logout} className='rounded-lg bg-black px-8 py-2 text-sm font-medium text-white
         hover:opacity-90 cursor-pointer'>
            Logout
        </button>
      </header>
    </div>
  )
}

export default StudentTopbar
