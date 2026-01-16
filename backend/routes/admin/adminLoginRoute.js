import adminLogin from "../../controllers/adminLogin.js";
import express from 'express';

const adminLoginRouter = express.Router();

adminLoginRouter.post('/adminLogin',adminLogin);

export default adminLoginRouter;