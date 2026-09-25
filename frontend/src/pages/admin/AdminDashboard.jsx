import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import {BookOpen, ClipboardList, Clock3, Library, RotateCcw} from "lucide-react"

const AdminDashboard = () => {
    const {adminStats} = useContext(AppContext);
    const stats = adminStats?.stats || {}
    const recentBorrows = adminStats?.recentBorrows || []

    const stateCards=[
      {
        title:"Total Books",
        value:stats.totalBooks || 0,
        icon : <BookOpen size={20}/>
      },

      {
        title:"Total Copies",
        value:stats.totalCopies || 0,
        icon : <Library size={20}/>
      },

      {
        title:"Borrowed Books",
        value:stats.borrowedBooksCount || 0,
        icon : <ClipboardList size={20}/>
      },

      {
        title:"Returned Books",
        value:stats.returnedBooksCount || 0,
        icon : <RotateCcw size={20}/>
      },

      {
        title:"Overdue Books",
        value:stats.overdueBooksCount || 0,
        icon : <Clock3 size={20}/>
      }
    ]
  return (
  <div className='w-full'>
    <div className='mb-8'>
      <h2 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h2>
      <p className='mt-1 text-sm text-gray-500'>
        Monitor books, borrows, returns, and overdue activity
      </p>
    </div>

    {/* Stats Cards */}

     <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {
      stateCards.map((item, index) => (
        <div key={index} className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-sm text-gray-500'>{item.title}</p>
              <h3 className='mt-3 text-3xl font-bold text-gray-800'>{item.value}</h3>
            </div>
            <div className='rounded-xl bg-black p-3 text-white'>
              {item.icon}
              </div>
          </div>
        </div>
      ))
    }
    </div>
       

       {/*Recent borrow activity*/}

       <div className='mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
        <div className='mb-5 flex items-center justify-between'>
          <h3>Recent Borrow Activity</h3>
          <p>Latest borrow and return records</p>
        </div>
       </div>

       {
        recentBorrows.length === 0? (
          <div className='rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500'> No recent Activity
            </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full border-separate border-spacing-y-3'>
                <thead>
                  <tr className='text-left text-sm text-gray-500'>
                    <th className='px-4'>Student</th>
                    <th className='px-4'>Book</th>
                    <th className='px-4'>Category</th>
                    <th className='px-4'>Due Date</th>
                    <th className='px-4'>Returned At</th>
                    <th className='px-4'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    recentBorrows.map((item)=>(
                      <tr key={item._id} className='rounded-xl bg-gray-50 text-gray-700'>
                        <td className='rounded-l-xl px-4 py-4 font-medium'>
                          <div>
                            {item.student.name}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {item.student?.email || ""}
                          </div>
                        </td>

                        <td className='px-4 py-4'>
                          {item.book?.title||"Book deleted"}
                        </td>
                        <td>
                          {item.book?.category||""}
                        </td>

                        <td className='px-4 py-4'>
                          {item.dueDate? new Date(item.dueDate).toLocaleDateString() : "N/A"}
                        </td>

                        <td className='px-4 py-4'>
                          {item.returnedAt? new Date(item.returnedAt).toLocaleDateString() : "Not Returned"}
                        </td>

                      
                        <td className='rounded-r-xl px-4 py-4'>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.status === "returned"? "bg-green-100 text-green-700"
                              : item.status === "borrowed"?
                            "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"}
                            }`}> 

                          </span>  {item.status}
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
  )
}    

export default AdminDashboard
