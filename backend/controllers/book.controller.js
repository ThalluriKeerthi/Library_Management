import Book from "../models/book.model.js"
import {v2 as cloudinary} from "cloudinary"
import Borrow from "../models/borrow.model.js";

//CREATE BOOK
export const createBook = async(req, res) => {
    try{
        const {title, description, category, language, totalCopies, availableCopies} = req.body;

        if(!title || !description || !category || !language || !totalCopies || !availableCopies) {
            return res.status(400).json({
                success :false,
                message : "Please provide all required fields"
            })
        }

        if(!req.file) {
            return res.status(400).json({
                success : false,
                message : "Book cover image is required"
            })
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder : "library_collection"
        })

        const book = await Book.create({
            title, description, category, language, totalCopies, availableCopies,
            coverImage : {
                public_id : result.public_id,
                url : result.secure_url,
            },
            addedBy : "admin"
        })

        return res.status(200).json({
            success : true,
            message : "Book added successfully"
        })
    }catch(error) {
         console.log(error);
        return res.status(500).json({
           
            success : false,
            message : "Failed to create Book",
            error : error.message
        })
    }
}

//GET ALL BOOKS + SEARCH + FILTER
export const getAllBooks = async(req, res) => {
    try{
        const {keyword, category, language, availableCopies} = req.query;

        let query = {};

        if(keyword) {
            query.title = {$regex : keyword, $options : "i"};
        }
        if(category) {
            query.category = category;
        }
        if(language) {
           query.language = {$regex : `^${language}$`, $options : "i"};
        }
        if(availableCopies === "true") {
            query.availableCopies = {$gte : 0};
        } 
        if (availableCopies === "false") {
            query.availableCopies = 0;
        }

        const books = await Book.find(query).sort({createdAt: -1});

        return res.status(200).json({
            success : true,
            count : books.length,
            books
        })
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Failed to fetch books",
            error : error.message
        })
    }
}

//GET SINGLE BOOK
export const getSingleBook = async(req, res) => {
    try{
        const book = await Book.findById(req.params.id);

        if(!book) {
            return res.status(400).json({
            success : false,
            message : "Book Not Found",
           });
        }

        return res.status(200).json({
            success : true,
            book,
        });
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Failed to fetch books",
            error : error.message
        })
    }
}

//UPDATE BOOK
export const updateBook = async(req, res) => {
    try {
        const {title, description, category, language, totalCopies, availableCopies} = req.body;

        let book = await Book.findById(req.params.id);

        if(!book) {
            return res.status(400).json({
                success : false,
                message : "Book Not Found",
            })
        }

        let updatedData = {};

        if(title !== undefined) {
            updatedData.title = title;
        }
        if(description !== undefined) {
            updatedData.description = description;
        }
        if(category !== undefined) {
            updatedData.category = category;
        }
        if(language !== undefined) {
            updatedData.language = language;
        }
        if(totalCopies !== undefined) {
            updatedData.totalCopies = totalCopies;
        }
        if(availableCopies !== undefined) {
            updatedData.availableCopies = availableCopies;  
        }
        if(req.file) {
            if(book.coverImage.Image?.public_id) {
                await cloudinary.uploader.destroy(book.coverImage.public_id);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder : "library_collection"
            });
            updatedData.coverImage = {
                public_id : result.public_id,
                url : result.secure_url,
            }
        }

        book = await Book.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators : true,
        });
        return res.status(200).json({
            success : true,
            message : "Book updated successfully",
            book,
        });

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Failed to update books",
            error : error.message
        })
    }
}

//DELETE BOOK
export const deleteBook = async(req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        if(!book) {
            return res.status(400).json({
                success : false,
                message : "Book Not Found",
            })
        }

        const activeBorrow = await Borrow.findOne({
            book : book._id,
            status : "borrowed"
        })

        if(activeBorrow) {
            return res.status(400).json({
                success : false,
                message : "Cannot delete book. It is currently borrowed by a student.",
            })
        }

        //destroy the cover image from cloudinary
        if(book.coverImage?.public_id) {
            await cloudinary.uploader.destroy(book.coverImage.public_id);
        }

        await book.deleteOne();

        return res.status(200).json({
            success : true,
            message : "Book deleted successfully",
        })
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Failed to delete book",
            error : error.message
        })
    }
}

//ADMIN DASHBOARD STATISTICS
export const getAdminDashboardStats = async(req, res) => {
    try{
        
        const totalBooks = await Book.countDocuments();
        const totalBorrowedRecords = await Borrow.countDocuments();
        const borrowedBooksCount = await Borrow.countDocuments({status : "borrowed"});
        const returnedBooksCount = await Borrow.countDocuments({status : "returned"});
        const overDueBorrowsCount = await Borrow.countDocuments({status : "borrowed", dueDate : {$lt : new Date()}});
        
        const books = await Book.find();
        const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
        const availableCopies = books.reduce((sum, book) => sum + book.availableCopies, 0);

        const recentBorrows = await Borrow.find().populate("student"," name email")
        .populate("book", "title category")
        .sort({createdAt : -1}).limit(5)
        
        return res.status(200).json({
            success : true,
            message : "Dashboard stats fetched successfully",
            stats : {
                totalBooks,
                totalCopies,
                borrowedBooksCount,
                returnedBooksCount,
                overDueBorrowsCount,
                totalCopies,
                availableCopies,
                totalBorrowedRecords
            },
            recentBorrows,
        });

    }catch(error) {
        return res.status(500).json({
            success : false,
            message : "Failed to fetch dashboard stats",
            error : error.message
        })
    }
}   

