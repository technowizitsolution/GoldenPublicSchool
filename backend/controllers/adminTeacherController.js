import Teacher from "../models/Teacher.js";

// Get all teachers
export const getAllTeachers = async(req,res) => {
    try{
        const teachers = await Teacher.find({isActive:true});
        res.status(200).json({message:'Teachers fetched successfully',teachers});
    }catch(error){
        console.error('Error fetching teachers : ',error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Create a new teacher
export const createTeacher = async(req,res) =>{
    try{
        console.log('Request Body:', req.body); // Debugging line
        const {email} = req.body;
        const teacherData = req.body;
        const existingTeacher = await Teacher.findOne({email});
        if(existingTeacher){
            return  res.status(400).json({message:'Teacher with this email already exists'});
        }
        const newTeacher = await Teacher.create(teacherData);
        res.status(201).json({message:'Teacher created successfully',teacher:newTeacher});
    }catch(error){
        console.error('Error creating teacher : ',error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete a teacher
export const deleteTeacher = async(req,res) =>{
    try{
        const {teacherId} = req.params;
        await Teacher.findByIdAndUpdate(teacherId, {isActive:false});
        console.log(`Teacher with ID ${teacherId} marked as deleted.`);
        res.status(200).json({message:'Teacher deleted successfully'});
    }catch(error){
        console.error('Error deleting teacher : ',error);
        res.status(500).json({ message: 'Internal server error' });
    }
}