import Borrow from "../models/borrow.model.js"
import Book from "../models/book.model.js"

//BORROW BOOK
export const borrowBook = async(req, res) => {
    try {
        if(req.user.role !== "student") {
            return res.status(403).json({ 
                success : false,
                message: "Only students can borrow books" 
            });
        }
        const {bookId, dueDate} = req.body;
        
        if(!bookId || !dueDate) {
            return res.status(400).json({ 
                success : false,
                message: "Book ID and due date are required" 
            });
        }

        const due = new Date(dueDate);
        if(isNaN(due.getTime())) {
            return res.status(400).json({ 
                success : false,
                message: "Invalid due date format" 
            });
        }

        if(due <= new Date()) {
            return res.status(400).json({
                success : false,
                message : "Due date must be in Future"
            });
        }

        const book = await Book.findById(bookId);
        if(!book) {
            return res.status(404).json({
                success : false,
                message : "Book Not found"
            });
        }

        //checking available copies
        if(book.availableCopies < 1) {
            return res.status(400).json({
                success : false,
                message : "Book out of stock"
            })
        }

        //User cannot borrow two books at a time
        const alreadyBorrowed = await Borrow.findOne({
            book : bookId,
            status : "borrowed"
        });

        if(alreadyBorrowed) {
            return res.status(400).json({ 
                success : false,
                message: "You have already borrowed this book and not yet returned it" 
            });
        }

        //student can borrow a maximum of 3 books
        const activeBorrowCount = await Borrow.countDocuments({
            student : req.user.id,
            status : "borrowed"
        });

        if(activeBorrowCount >= 3) {
            return res.status(400).json({ 
                success : false,
                message: "Borrow limit reached. You can only borrow up to 3 Books at a time." 
            });
        }

        const overDueBook = await Borrow.findOne({
            student : req.user.id,
            status : "borrowed",
            dueDate : {$lt : new Date()},
        });

        if(overDueBook) {
            return res.status(400).json({ 
                success : false,
                message: "You have a overdue book. Return it before borrowing a new one." 
           });
        }

        const updatedBook = await Book.findOneAndUpdate(
            {_id : bookId, availableCopies : {$gte : 1}},
            {$inc : {availableCopies : - 1}},
             {new : true}
        );

        if(!updatedBook) {
            return res.status(400).json({ 
                success : false,
                message: "Book is out of Stock" 
           });
        }

        const borrow = await Borrow.create({
            student : req.user.id,
            book : bookId,
            dueDate,
        });

        return res.status(201).json({ 
            success : true,
            message: "Book borrowed successfully" 
        });
    } catch(error) {
        return res.status(500).json({ 
            success : false,
            message: "Error borrowing book" 
        });
    }
}

//RETURN BOOK
export const returnBook = async(req, res) => {
    try {
        const {borrowId} = req.body;

        if(!borrowId) {
            return res.status(500).json({ 
                success : false,
                message: "Borrow Id is required" 
            });
        }

        const borrowRecord = await Borrow.findById(borrowId);

        if(!borrowRecord) {
            return res.status(404).json({ 
                success : false,
                message: "Borrow Record Not found" 
            });
        }

        if(borrowRecord.status === "returned") {
            return res.status(400).json({ 
                success : false,
                message: "Book already returned" 
            });
        }

        //checking the case - student can return only his/her borrowed book
        if(borrowRecord.student.toString() !== req.user.id) {
           return res.status(403).json({ 
                success : false,
                message: "You can only return your own borrowed books" 
            });
        }

        const book = await Book.findById(borrowRecord.book);

        if(!book) {
            return res.status(404).json({ 
                success : false,
                message: "Book Not Found", 
            });
        }

        //updating the borrow record
        borrowRecord.status = "returned";
        borrowRecord.returnDate = new Date();
        await borrowRecord.save();

        //updating the book available copies
        book.availableCopies += 1;
        await book.save();

        return res.status(200).json({ 
            success : true,
            message: "Book returned successfully" ,
            borrowRecord
        });
    } catch(err) {
        return res.status(500).json({ 
            success : false,
            message: "Error returning book" 
        });
    }
} 

//GET MY BORROWED BOOKS
export const getMyBorrowedBooks = async(req, res) => {
    try {
        const borrowedBooks = await Borrow.find({student : req.user.id}).populate("book").sort({createdAt : -1});
        const updatedBorrowedBooks = borrowedBooks.map((item) => {
            const isOverdue = item.status === "borrowed" && new Date(item.dueDate) < new Date();
            return {
                ...item._doc,
                isOverdue,
            }
        })

        return res.status(200).json({ 
            success : true,
            message: "Borrowed books fetched successfully",
            count : updatedBorrowedBooks.length,
            borrowedBooks: updatedBorrowedBooks
        });
    }catch(error) {
        return res.status(500).json({ 
                success : false,
                message: "Error fetching borrowed books" 
        });
    }
}

//GET ALL BORROWED BOOKS (ADMIN)
export const getAllBorrowedBooks = async(req, res) => {
    try{
        const records = await Borrow.find().populate("student","name email")
        .populate("book","title author").sort({createdAt : -1});

        const updatedRecords = records.map((item) => {
            const isOverdue = item.status === "borrowed" && new Date(item.dueDate) < new Date();
            return {
                ...item._doc,
                isOverdue,
            }
        })

        return res.status(200).json({ 
            success : true,
            message: "Borrowed books fetched successfully",
            count : updatedRecords.length,
            records: updatedRecords
        });

    }catch(error) {
        return res.status(500).json({ 
                success : false,
                message: "Error fetching borrowed books" 
        });
    }
}

//GET OVERDUE BORROWED BOOKS (ADMIN)
export const getAllOverDueBooks = async(req, res) => {
    try{
        const overdueBooks = await Borrow.find({
            status : "borrowed",
            dueDate : {$lt : new Date()}
        }).populate("student","name","email")
        .populate("book","title","author").sort({createdAt : -1});

        return res.status(200).json({ 
            success : true,
            message: "Borrowed books fetched successfully",
            count : overdueBooks.length,
            overdueBooks : overdueBooks
        });

    }catch(error) {
        return res.status(500).json({ 
                success : false,
                message: "Error fetching borrowed books" 
        });
    }
}

//STUDENT DASHBOARD STATISTICS
export const getStudentDashboard = async(req, res) => {
    try{
        if(req.user.role !== "student") {
            return res.status(403).json({
                success : false,
                message : "Only students can access this dashboard",
            });
        }

        const studentId = req.user.id;

        const totalBorrowed = await Borrow.countDocuments({
            student : studentId,
        });

        const currentlyBorrowed = await Borrow.countDocuments({
            student : studentId,
            status : "borrowed",
        });

        const returnedBooks = await Borrow.countDocuments({
            student : studentId,
            status : "returned",
        });

        const overDueBooks = await Borrow.countDocuments({
            student : studentId,
            status : "borrowed",
            dueDate : {$lt : new Date()},
        });

        const recentActivity = await Borrow.find({student : studentId})
        .populate("book","title category coverImage")
        .sort({createdAt : -1}).limit(5);

        const updatedActivity = recentActivity.map((item) => {
            const isOverdue = item.status === "borrowed" && new Date(item.dueDate) < new Date();
            const daysLate = isOverdue 
    ? Math.ceil((new Date() - new Date(item.dueDate)) / (1000 * 60 * 60 * 24)) 
    : 0;

            return {
                ...item._doc,
                isOverdue,
                daysLate,
            };
        });

        return res.status(200).json({
            success : true,
            dashboard : {
                totalBorrowed,
                currentlyBorrowed,
                returnedBooks,
                overDueBooks,
                recentActivity : updatedActivity,
            }
        })
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Error displaying dashboard",
        })
    }
}