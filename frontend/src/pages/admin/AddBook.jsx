import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { axiosInstance } from '../../utils/axiosinstance';

const AddBook = () => {
    const {loading,setLoading,navigate,fetchBooks,fetchAdminDashboardStats} = useContext(AppContext);
    const [preview,setPreview] = useState(null);
    const [coverImage,setcoverImage] = useState(null);

    const [formData,setFormData] = useState({
        title:"",
        description:"",
        category:"",
        language:"English",
        totalCopies:"",
        availableCopies:""
    });

    const categories = [
        "Science",
        "History", "Technology","Education","Other"
    ]

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if(file) {
            setcoverImage(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    useEffect(()=>{
        return () => {
            if(preview) {
                URL.revokeObjectURL(preview)
            }
        }
    },[preview]);
    

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!coverImage) {
            return toast.error("Please upload book cover image")
        }

        if(Number(formData.availableCopies) > Number(formData.totalCopies)) {
            return toast.error("Available copies cannot be greater than total copies");
        }

        try {
            setLoading(true);
            const dataToSend = new FormData();
            dataToSend.append("title", formData.title);
            dataToSend.append("description", formData.description);
            dataToSend.append("category", formData.category);
            dataToSend.append("language", formData.language);
            dataToSend.append("totalCopies", formData.totalCopies);
            dataToSend.append("availableCopies", formData.availableCopies);
            dataToSend.append("coverImage", coverImage);

            const {data} = await axiosInstance.post("/books/create",dataToSend,{
                headers: {
                    "Content-Type" : "multipart/form-data"
                }
            })

            if(data.success) {
                toast.success(data.message);
                navigate("/admin/books")
                fetchBooks()
                fetchAdminDashboardStats();
            }

        } catch(error) {
            toast.error("Failed to add book")
        }
        finally {
            setLoading(false);
        }
    }

  return (
    <div className='w-full '>
        <div  className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>Add New Book</h2>
            <p className='mt-1 text-sm text-gray-500'>
                Fill the details below to add a new book to the library.
            </p>
        </div>
        <form onSubmit = {handleSubmit} className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/*Image Upload*/}
          <div className='lg:col-span-1'>
            <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>

                <h3 className='mb-4 text-lg font-semibold text-gray-800'>Book Cover</h3>

                <div className='flex h-72 items-center justify-center overflow-hidden rounded-xl
                border-2 border-dashed border-gray-300 bg-gray-50'>
                    {
                        preview ? (
                            <img src={preview} alt = "Preview"/>
                        ) : (
                            <div className='text-center'>
                                <p className='text-sm font-medium text-gray-600'>Upload cover Image</p>
                                <p className='mt-1 text-xs text-gray-400'>PNG, JPG, JPEG supported</p>
                            </div>
                        )
                    }
                </div>

                <input type='file' accept='image/' onChange={handleImageChange}
                className='mt-4 block w-full cursor-pointer rounded-lg border border-gray-300 text-sm
                text-gray-600 file:mr-4 file:border-0 file:bg-black file:px-4 file:py-3 file:text-sm
                file:font-medium file:text-white hover:file:opacity-90'/>

            </div>
          </div>

          {/*Book Info */}

          <div className='lg:col-span-2'>
            <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>

                <h3 className='mb-5 text-lg font-semibold text-gray-800'>Book Information</h3>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='md:col-span-2'>
                         <label htmlFor='' className='mb-1 block text-sm font-medium text-gray-700'>
                            Title
                         </label>

                         <input type='text' name='title' value={formData.title}
                           onChange={handleChange} required placeholder='Enter book title'
                           className='h-12 w-full rounded-lg border border-gray-300 px-4 text-sm
                           outline-none focus:border-black'
                         />
                    </div>

                    <div className='md:col-span-2'>
                         <label htmlFor='' className='mb-1 block text-sm font-medium text-gray-700'>
                            Description
                         </label>

                         <textarea name='description' value={formData.description}
                           onChange={handleChange} required rows='5'
                           placeholder='Enter book description'
                           className=' w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                           outline-none focus:border-black'
                         />
                    </div>

                    <div className='md:col-span-2'>
                         <label className='mb-1 block text-sm font-medium text-gray-700'>
                            Category
                         </label>

                         <select name='category' value={formData.category}
                           onChange={handleChange} required 
                           className='h-12 w-full rounded-lg border border-gray-300 px-4 text-sm
                           outline-none focus:border-black'
                         > 
                         <option value="">Select Category</option>
                         {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                         ))}
                         </select>
                    </div>

                    <div className='md:col-span-2'>
                         <label className='mb-1 block text-sm font-medium text-gray-700'>
                            Language
                         </label>

                         <input type='text' name='language' value={formData.language}
                           onChange={handleChange} required placeholder='English'
                           className='h-12 w-full rounded-lg border border-gray-300 px-4 text-sm
                           outline-none focus:border-black'
                         />
                    </div>

                    <div className='md:col-span-2'>
                         <label className='mb-1 block text-sm font-medium text-gray-700'>
                            Total Copies
                         </label>

                         <input type='number' name='totalCopies' value={formData.totalCopies}
                           onChange={handleChange} required min='1' placeholder='10'
                           className='h-12 w-full rounded-lg border border-gray-300 px-4 text-sm
                           outline-none focus:border-black'
                         />
                    </div>

                    <div className='md:col-span-2'>
                         <label className='mb-1 block text-sm font-medium text-gray-700'>
                            Available Copies
                         </label>

                         <input type='number' name='availableCopies' value={formData.availableCopies}
                           onChange={handleChange} required min='0' placeholder='10'
                           className='h-12 w-full rounded-lg border border-gray-300 px-4 text-sm
                           outline-none focus:border-black'
                         />
                    </div>

                </div>

                <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end'>

                    <button type='button' onClick={()=>navigate("/admin/books")} 
                    className='h-11 rounded-lg border border-gray-300 px-6 text-sm font-medium 
                    text-gray-700 hover:bg-gray-50'>
                        Cancel
                    </button>

                    <button type='submit' disabled={loading} 
                    className='h-11 rounded-lg border border-gray-300 px-6 text-sm font-medium 
                    text-gray-700 hover:bg-gray-50'>
                        {loading ? "Adding..." : "Add Book"}
                    </button>

                </div>

            </div>
          </div>
        </form>
    </div>
  )
}

export default AddBook