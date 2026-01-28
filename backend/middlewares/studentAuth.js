import jwt from 'jsonwebtoken';

const studentAuth = (req,res,next) => {
    try{
        const {token} = req.headers;
        if(!token){
            return res.json({success:false,message:"Unauthorized access"});
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log('Decoded token : ',token_decode);
        req.student = token_decode;
        next();
    }catch(error){
        console.error('Authentication error : ',error);
        res.json({success:false,message:"Unauthorized access"});
    }
}

export default studentAuth;