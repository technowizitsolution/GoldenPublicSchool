import Class from "../models/Class.js";

//Get all classes
export const getAllClasses = async(req,res) =>{
    try{
        const classes = await Class.find({});
        res.status(200).json({message:'Classes fetched successfully',classes});
    }catch(error){
        console.error('Error fetching classes : ',error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


//Create a new class
export const createClass = async(req,res) =>{
    try{
        console.log('Request Body:', req.body); // Debugging line
        
    }catch(error){
        console.error('Error creating class : ',error);
        res.status(500).json({ message: 'Internal server error' });
    }
}