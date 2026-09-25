import mongoose from "mongoose"

export const borrowSchema = new mongoose.Schema({
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    
    book : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Book",
        required : true,
    },
    borrowedAt : {
        type : Date,
        default : Date.now,
    },
    dueDate: {
        type : Date,
        required : true
    },
    returnedAt : {
        type : Date,
        default : null,
    },
    status : {
        type : String,
        enum : ["borrowed","returned"],
        default : "borrowed",
    },
},
    
    {timestamps : true}
);

const Borrow = mongoose.model("Borrow",borrowSchema);

export default Borrow;