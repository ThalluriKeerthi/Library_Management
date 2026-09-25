import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Edit2Icon, Trash2Icon } from 'lucide-react'

const BookBorrowed = () => {
    const {borrowedBooks, loading, fetchBorrowedBooks,navigate} = useContext(AppContext)

  return (
    <div className='w-full'>
        <div className='mb-8 flex flex-row items-center justify-between'>
           <div>
             <h2 className='text-2xl font-bold text-gray-800'>Borrowed Book Overview</h2>
             <p className='mt-1 text-sm text-gray-500'>Monitor borrowed books</p>
           </div>
        </div>
  

        {/*Borrowed Books Table */}
        <div className='mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
           {
        borrowedBooks.length === 0? (
          <div className='rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500'> No borrow 
          records found.
            </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full border-separate border-spacing-y-3'>
                <thead>
                  <tr className='text-left text-sm text-gray-500'>
                    <th className='px-4'>Book Title</th>
                    <th className='px-4'>Book Category</th>
                    <th className='px-4'>Student name</th>
                    <th className='px-4'>Student email</th>
                    <th className='px-4'>Borrowed Date</th>
                    <th className='px-4'>Returned Date</th>
                    <th className='px-4'>Due Date</th>
                    <th className='px-4'>overdue</th>

                  </tr>
                </thead>
                <tbody>
                  {
                    borrowedBooks.map((item)=>(
                      <tr key={item._id} className='rounded-xl bg-gray-50 text-gray-700'>
                        <td className='rounded-l-xl px-4 py-4 font-medium'>
                          <div>
                            {item.book.title}
                          </div>
        
                        </td>

                        <td>
                          {item.book.category}
                        </td>

                        <td className='px-4 py-4'>
                          {item.student.name}
                        </td>

                        <td className='px-4 py-4'>
                          {item.student.email}
                        </td>

                      
                        <td className='rounded-r-xl px-4 py-4'>
                          {item.borrowedAt ? new Date(item.borrowedAt).toLocaleDateString() : "N/A"} 
                        </td>

                        <td className='rounded-r-xl px-4 py-4'>
                          {item.returnedAt ? new Date(item.returnedAt).toLocaleDateString() : "Not Returned"} 
                        </td>

                        <td className='rounded-r-xl px-4 py-4'>
                          {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "N/A"} 
                        </td>

                        <td className='rounded-r-xl px-4 py-4'>
                          {item.isOverdue ? "Yes" : "No"} 
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

export default BookBorrowed