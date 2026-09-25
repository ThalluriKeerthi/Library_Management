import {createContext} from "react"
import { axiosInstance } from "../utils/axiosinstance";
import { useState,useEffect} from "react";
import {useNavigate} from 'react-router-dom';


export const AppContext = createContext()

const AppContextProvider = ({children}) => {

    const [loading,setLoading] = useState(false);
    const [user,setUser] = useState(null);
    const [adminStats,setAdminStats] = useState();
    const [books, setBooks] = useState([]);
    const [studentBooks, setStudentBooks] = useState([]);
    const [students, setStudents] = useState([]);
    const [borrowedBooks,setBorrowedBooks] = useState([]);
    const [overdue, setOverdue] = useState([]);

    const [studentStats,setStudentStats] = useState([]);

    const isAdmin = user && user.role==='admin';
    const navigate = useNavigate();

   //  if(!user) {
   //      navigate("/login");
   //  }

    const fetchUser=async()=>{
        try {
            const {data} = await axiosInstance.get("/auth/me");
            if(data.success) {
                setUser(data.user)
            }
        }catch(error) {
            setUser(null)
        }
    }

    //Fetch Admin Dashboard stats
    const fetchAdminDashboardStats = async()=>{
        try{
           const {data} = await axiosInstance.get("/books/admin/dashboard")
           if(data.success) {
              setAdminStats(data)
           }
        }catch(error) {
           console.log("error to fetch admin stats",error)
        }
    }

    //Fetch Student Dashboard stats
    const fetchStudentDashboardStats = async()=>{
        try{
           const {data} = await axiosInstance.get("/borrow/student/dashboard")
           if(data.success) {
              setStudentStats(data)
           }
        }catch(error) {
           console.log("error to fetch admin stats",error)
        }
    }

    //Fetch Books
    const fetchBooks = async()=>{
        try{
           const {data} = await axiosInstance.get("/books/all")
           if(data.success) {
              setBooks(data.books)
           }
        }catch(error) {
           console.log("error to fetch books",error)
        }
    }

    //Fetch Student Books
    const fetchStudentBooks = async()=>{
        try{
           const {data} = await axiosInstance.get("/borrow/my-books")
           if(data.success) {
              setStudentBooks(data.borrowedBooks)
           }
        }catch(error) {
           console.log("error to fetch books",error)
        }
    }

    //Fetch Students
    const fetchStudents = async()=>{
        try{
           const {data} = await axiosInstance.get("/admin/students")
           if(data.success) {
              setStudents(data.students)
           }
        }catch(error) {
           console.log("error to fetch students",error)
        }
    }
    

    //Fetch All Borrowed Books
    const fetchBorrowedBooks = async()=>{
        try{
           const {data} = await axiosInstance.get("/borrow/admin/all")
           if(data.success) {
              setBorrowedBooks(data.records)
           }
        }catch(error) {
           console.log("error to fetch borrowed books",error)
        }
    }

    //Fetch All overdue Books
    const fetchOverdue = async()=>{
        try{
           const {data} = await axiosInstance.get("/borrow/admin/overdue")
           if(data.success) {
              setOverdue(data.overdueBooks)
           }
        }catch(error) {
           console.log("error to fetch overdue books",error)
        }
    }

    useEffect(()=>{
        fetchUser()
        fetchBooks();
        fetchStudentDashboardStats();
        fetchStudentBooks();
    },[])

    useEffect(() =>{
        if(isAdmin) {
            fetchAdminDashboardStats();
            fetchStudents()
            fetchBorrowedBooks();
            fetchOverdue();
        }
    },[isAdmin])

    const value={loading,setLoading,user,setUser,navigate,adminStats,fetchAdminDashboardStats,
        books,fetchBooks,students,fetchStudents,borrowedBooks,fetchBorrowedBooks, overdue, fetchOverdue,
    studentStats, fetchStudentDashboardStats,studentBooks,fetchStudentBooks}

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider