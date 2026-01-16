import mongoose from 'mongoose';

export const connectDB = async () =>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/practise`);
        console.log('MongoDB connected successfully');
    }catch(err){
        console.error('MongoDB connection error:', err);
    }
}
