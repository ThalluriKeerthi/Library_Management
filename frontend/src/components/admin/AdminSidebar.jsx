import React from 'react'

import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  ClipboardList,
  RotateCcw,AlertTriangle,Users
} from "lucide-react"; 
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {

  const navLinkClass = ({isActive}) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium
   transition ${isActive ? "bg-white text-black" : "text-white/80 hover:bg-white/10 hover:text-white"}`;

  return (
    <aside className='w-[260px] bg-black text-white px-4 py-6 hidden md:block' >
      {/*Logo*/}
      <div className='mb-8 border-b border-white/10 pb-4'>
        <h1 className='text-2xl font-bold'> BookWorm</h1>
        <p className='text-sm text-white/70'>Admin Panel</p>
      </div>

      {/*Navigation*/}
      <nav className='flex flex-col gap-2'>
        <NavLink to='/admin/dashboard' className={navLinkClass}>
            <LayoutDashboard size={18}/>
            Dashboard
        </NavLink>

        <NavLink to='/admin/books' className={navLinkClass}>
            <BookOpen size={18}/>
            Books
        </NavLink>

        <NavLink to='/admin/add-book' className={navLinkClass}>
            <PlusCircle size={18}/>
            Add Book
        </NavLink>

        <NavLink to='/admin/borrowed-books' className={navLinkClass}>
            <ClipboardList size={18}/>
            Borrowed
        </NavLink>

        {/* <NavLink to='/admin/dashboard' className={navLinkClass}>
            <RotateCcw size={18}/>
            Returned
        </NavLink> */}

        <NavLink to='/admin/overdue' className={navLinkClass}>
            <AlertTriangle size={18}/>
            Overdue
        </NavLink>

        <NavLink to='/admin/students' className={navLinkClass}>
            <Users size={18}/>
            Users
        </NavLink>

      </nav>
    </aside>
  )
}

export default AdminSidebar
