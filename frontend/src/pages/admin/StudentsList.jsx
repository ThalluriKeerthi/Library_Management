import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Edit2Icon, Trash2Icon } from 'lucide-react'
import { axiosInstance } from '../../utils/axiosinstance'
import toast from "react-hot-toast"

const StudentsList = () => {
    const {students,fetchStudents} = useContext(AppContext)

    const deleteStudent = async(id) => {
      try{
        const {data} = await axiosInstance.delete(`admin/students/${id}`)
        if(data.success) {
          toast.success(data.message)
          fetchStudents()
        }
      } catch(error) {
        toast.error(error.response?.data?.message)
      }
    }

  return (
    <div className='w-full'>
        <div className='mb-g flex flex-row items-center justify-between'>
           <div>
             <h2 className='text-2xl font-bold text-gray-800'>Students Overview</h2>
             <p className='mt-1 text-sm text-gray-500'>Monitor Students</p>
           </div>
           
        </div>
        
        {/*Students Table */}
        <div className='mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
           {
        students.length === 0? (
          <div className='rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500'> No students found
            </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full border-separate border-spacing-y-3'>
                <thead>
                  <tr className='text-left text-sm text-gray-500'>
                    <th className='px-4'>Name</th>
                    <th className='px-4'>email</th>
                    <th className='px-4'>role</th>
                    <th className='px-4'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    students.map((item)=>(
                      <tr key={item._id} className='rounded-xl bg-gray-50 text-gray-700'>
                        <td className='rounded-l-xl px-4 py-4 font-medium'>
                          <div>
                            {item.name}
                          </div>
        
                        </td>

                        <td>
                          {item.email}
                        </td>

                        <td className='px-4 py-4'>
                          {item.role}
                        </td>

                        <td className='px-4 py-4 flex gap-2'>
                          <Trash2Icon onClick={()=>deleteStudent(item._id)} 
                          className='text-red-500 w-5 h-5 cursor-pointer'/>

                        </td>
                              

                      </tr>
                    ))
                  }
                </tbody>
            </table>
          </div>
        )
       }

        </div>
    </div>
  )
}

export default StudentsList