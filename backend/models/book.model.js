import mongoose from "mongoose";

export const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : [true, "Description is required"],
    },
    category : {
        type : String,
        required : [true,"Category is required"],
        enum : [
            "Fiction",
            "Non-Fiction",
            "Science", "History", "Education","Technology","Education","Other"],
    },
    language : {
        type : String,
        required : true
    },
    coverImage: {
       public_id : {
        type : String,
        required : true,
       },
       url : {
        type : String,
        required : true
       }
    },
    totalCopies : {
        type : Number,
        required : [true, "Total Copies required"],
        min : 1,
    },
    availableCopies : {
        type : Number,
        required : [true, "Available Copies required"],
        min : 0,
    },
    addedBy : {
        type : String,
        default : "admin"
    },
},
{timestamps : true}
);

const Book = mongoose.model("Book",bookSchema);

export default Book;