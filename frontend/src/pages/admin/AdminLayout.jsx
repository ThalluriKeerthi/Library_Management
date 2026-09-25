import React from 'react'
import AdminSidebar from "../../components/admin/AdminSidebar"
import AdminTopbar from "../../components/admin/AdminTopbar"
import {Outlet} from "react-router-dom"

const AdminLayout = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex min-h-screen'>
        <AdminSidebar/>
        {/*Right content*/}
          <div className='flex-1 flex flex-col'>
            {/*Top bar*/}
            <AdminTopbar/>
            {/*Outlet Content*/}
            <main className='flex-1'>
              <div className='rounded-2xl bg-white p-4 sm:p-6 shadow-sm min-h-[calc(100vh-120px)]'>
                 <Outlet/>
              </div>
            </main>
          </div>
      </div>
    </div>
  )
}

export default AdminLayout
