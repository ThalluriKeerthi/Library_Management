import User from "../models/user.model.js";
import Borrow from "../models/borrow.model.js"

//GET ALL STUDENTS
export const getAllStudents = async(req, res) => {
    try{
        const students = await User.find().select("-password").sort({createdAt : -1});

        return res.status(200).json({
            success : true,
            count : students.length,
            students,
        })
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Error while fetching students",
        })
    }
}

//GET SINGLE STUDENT
export const getSingleStudent = async(req, res) => {
    try{
         const student = await User.findById(req.params.Id).select("-password");

         if(!student) {
             return res.status(404).json({
                success : false,
                message : "Student Not found",
            })
         }

         return res.status(200).json({
            success : true,
            student,
        });
    }catch(error) {
        return res.status(500).json({
            success : false,
            message : "Error while fetching student",
        })
    }
}

//DELETE STUDENT
export const deleteStudent = async(req, res) => {
    try{
        const student = await User.findById(req.params.id);

        if(!student) {
            return res.status(404).json({
                success : false,
                message : "Student Not found",
            })
        }

        const activeBorrows = await Borrow.countDocuments({
            student : student._id,
            status : "borrowed",
        });

        if(activeBorrows > 0) {
            return res.status(409).json({
                success : false,
                message : "Cannot delete student because they still have borrowed books",
            });
        }

        await student.deleteOne();

        return res.status(200).json({
            success : true,
            message : "Student deleted successfully",
        });
        
    }catch(error) {
        return res.status(500).json({
            success : false,
            message : "Error deleting student",
        })
    }
}