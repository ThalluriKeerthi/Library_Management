import React from 'react'

import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  ClipboardList,
  RotateCcw,AlertTriangle,Users
} from "lucide-react"; 
import { NavLink } from 'react-router-dom';

const StudentSidebar = () => {

  const navLinkClass = ({isActive}) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium
   transition ${isActive ? "bg-white text-black" : "text-white/80 hover:bg-white/10 hover:text-white"}`;

  return (
    <aside className='w-[260px] bg-black text-white px-4 py-6 hidden md:block' >
      {/*Logo*/}
      <div className='mb-8 border-b border-white/10 pb-4'>
        <h1 className='text-2xl font-bold'> BookWorm</h1>
        <p className='text-sm text-white/70'>Student Panel</p>
      </div>

      {/*Navigation*/}
      <nav className='flex flex-col gap-2'>
        <NavLink to='/student/dashboard' className={navLinkClass}>
            <LayoutDashboard size={18}/>
            Dashboard
        </NavLink>

        <NavLink to='/student/books' className={navLinkClass}>
            <BookOpen size={18}/>
            Books
        </NavLink>

        <NavLink to='/student/my-books' className={navLinkClass}>
            <PlusCircle size={18}/>
            My Books
        </NavLink>

        
      </nav>
    </aside>
  )
}

export default StudentSidebar
