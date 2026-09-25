import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { BookOpen, ClipboardList, Library } from 'lucide-react';

const StudentDashboard = () => {

    const {studentStats} = useContext(AppContext);

    const stats = studentStats?.dashboard || {}
    const recentActivity = studentStats?.dashboard?.recentActivity || [];
    const statsCards = [
        {
            title:"Total Borrowed Books",
            value:stats.totalBorrowed || 0,
            icon:<BookOpen size={20}/>
        },
        {
            title:"Currently Borrowed",
            value:stats.currentlyBorrowed || 0,
            icon:<Library size={20}/>
        },
        {
            title:"Overdue Books",
            value:stats.overDueBooks || 0,
            icon:<ClipboardList size={20}/>
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
      statsCards.map((item, index) => (
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
          <p>Your Latest borrow and return records</p>
        </div>
       </div>

       {
        recentActivity.length === 0? (
          <div className='rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500'> No recent borrow 
          Activity found.
            </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full border-separate border-spacing-y-3'>
                <thead>
                  <tr className='text-left text-sm text-gray-500'>
                    <th className='px-4'>Book</th>
                    <th className='px-4'>Category</th>
                    <th className='px-4'>Borrowed At</th>
                    <th className='px-4'>Due Date</th>
                    <th className='px-4'>Returned At</th>
                    <th className='px-4'>Status</th>
                    <th className='px-4'>Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    recentActivity.map((item)=>(
                      <tr key={item._id} className='rounded-xl bg-gray-50 text-gray-700'>
                       
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
  item.status === "returned" ? "bg-green-100 text-green-700"
  : item.status === "borrowed" ? "bg-yellow-100 text-yellow-700"
  : "bg-gray-100 text-gray-700"
}`}>
  {item.status}
</span>
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

export default StudentDashboard
