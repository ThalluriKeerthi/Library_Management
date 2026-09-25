import React from 'react'
import {Toaster} from 'react-hot-toast'

import {Routes, Route, useLocation} from 'react-router-dom'
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import ForgotPassword from './pages/auth/forgotPassword'
import ResetPassword from './pages/auth/resetPassword'
import AdminLayout from './pages/admin/AdminLayout'
import BookList from './pages/admin/BookList'
import AddBook from './pages/admin/AddBook'
import UpdateBook from './pages/admin/UpdateBook'
import BookBorrowed from './pages/admin/BookBorrowed'
import OverdueBooks from './pages/admin/OverdueBooks'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentsList from './pages/admin/StudentsList'
import AddStudent from './pages/admin/AddStudent'
import UpdateStudent from './pages/admin/UpdateStudent'
import StudentLayout from './pages/student/Layout'
import MyBooks from './pages/student/MyBooks'
import Books from './pages/student/Books'
import StudentDashboard from './pages/student/StudentDashboard'

const App = () => {

  const location = useLocation()
  const adminPath=location.pathname.includes("/admin")

  return (
    <>
    <Toaster />

    <Routes>
      {/* Auth Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="books" element={<BookList />} />
        <Route path="add-book" element={<AddBook />} />
        <Route path="book/update/:id" element={<UpdateBook />} />
        <Route path="borrowed-books" element={<BookBorrowed />} />
        <Route path="overdue" element={<OverdueBooks />} />
       <Route path="students" element={<StudentsList/>}/>
        <Route path="student-add" element={<AddStudent />} />
        <Route path="student/update/:id" element={<UpdateStudent />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="my-books" element={<MyBooks/>} />
      </Route>
    </Routes>
    </>
);
}

export default App
