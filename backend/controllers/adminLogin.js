import jwt from 'jsonwebtoken';
const adminLogin = async (req, res) => {
    try{
        const {email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token});
        }
    }
    catch (error) {
        console.log('Error during admin login : ', error);
        res.json({ success: false, message: "Internal server error" });
    }
}

export default adminLogin;