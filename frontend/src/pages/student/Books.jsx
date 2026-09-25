import React from 'react'
import { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import toast from "react-hot-toast";
import { axiosInstance } from '../../utils/axiosinstance';

const Books = () => {

    const {books, fetchBooks, navigate} = useContext(AppContext);
    const [selectedDates, setSelectedDates] = useState({});

    const handleChange = (bookId, date) => {
       setSelectedDates({
         ...setSelectedDates,
         [bookId] : date,
       });
    }

    
      const handleDateChange = (bookId, date) => {
    setSelectedDates({
      ...selectedDates,
      [bookId]: date,
    });
  };

    const handleBorrow = async(bookId)=> {
       try{
            const dueDate = selectedDates[bookId];

            if(!dueDate) {
                return toast.error("Please select due date");
            } 

            const {data} = await axiosInstance.post("/borrow/borrow", {
                bookId,
                dueDate
            });

            if(data.success) {
                toast.success("Book borrowed successfully");
                fetchBooks();
            }

       }catch(error) {
            toast.error(error?.response?.data?.message || "Failed to borrow book")
       }
    }

    return (
    <div className='w-full'>
        <div className='mb-8 flex flex-row items-center justify-between'>
           <div>
             <h2 className='text-2xl font-bold text-gray-800'>Book Overview</h2>
             <p className='mt-1 text-sm text-gray-500'>Monitor books</p>
           </div>
           
        </div>
        
        {/*Books Table */}
        <div className='mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
           {
        books.length === 0? (
          <div className='rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500'> No books found
            </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full border-separate border-spacing-y-3'>
                <thead>
                  <tr className='text-left text-sm text-gray-500'>
                    <th className='px-4'>Title</th>
                    <th className='px-4'>Image</th>
                    <th className='px-4'>Category</th>
                    <th className='px-4'>total Copies</th>
                    <th className='px-4'>Available Copies</th>
                    <th className='px-4'>Language</th>
                    <th className='px-4'>Due Date</th>
                    <th className='px-4'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    books.map((item)=>(
                      <tr key={item._id} className='rounded-xl bg-gray-50 text-gray-700'>
                        <td className='rounded-l-xl px-4 py-4 font-medium'>
                          <div>
                            {item.title}
                          </div>
        
                        </td>

                        <td className='px-4 py-4'>
                           <img src={item.coverImage.url} alt = {item.title} className='h-14 w-14 object-cover rounded'/>
                        </td>
                        <td>
                          {item.category}
                        </td>

                        <td className='px-4 py-4'>
                          {item.totalCopies}
                        </td>

                        <td className='px-4 py-4'>
                          {item.availableCopies}
                        </td>

                      
                        <td className='rounded-r-xl px-4 py-4'>
                          {item.language}
                        </td>

                        <td>
                            <input
                            type='date' min = {new Date().toISOString().split("T")[0]}
                            value={selectedDates[item._id] || ""}
                            onChange={(e) => 
                                handleDateChange(item._id, e.target.value)
                            }
                            disabled = {item.availableCopies < 1}
                            className='rounded-lg border birder-gray-300 px-3 py-2 text-sm outline-none
                            focus:border-black disabled:bg-gray-100'
                            />
                        </td>

                        <td className='rounded-r-xl px-4 py-4'>
                            <button 
                                onClick={() => handleBorrow(item._id)}
                                disabled = {item.availableCopies < 1}
                                className={`px-4 py-2 text-xs font-medium rounded-lg
                                     ${item.availableCopies < 1 ? 
                                        "bg-gray-300 text-gray-500 cursor-not-allowed" : 
                                        "bg-green-600 text-white hover:opacity-9" }`}>
                                    {item.availableCopies < 1 ? "Out of Stock" : "Borrow"}
                            </button>
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
export default Books
