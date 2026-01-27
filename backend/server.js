import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { connectDB } from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';
import adminStudentRouter from './routes/admin/adminStudentRoute.js';
import adminTeacherRouter from './routes/admin/adminTeacherRoute.js';
import adminLoginRouter from './routes/admin/adminLoginRoute.js';
import adminClassRouter from './routes/admin/adminClassRoute.js';
import adminUniformRouter from './routes/admin/adminUniformRoutes.js';
import adminBooksRouter from './routes/admin/adminBooksRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();
await connectCloudinary();

app.get('/', (req,res) => {
    res.send("Hello, World !");
});

app.use('/admin',adminStudentRouter);
app.use('/admin',adminTeacherRouter);
app.use('/',adminLoginRouter);
app.use('/admin',adminClassRouter);
app.use('/admin/uniforms',adminUniformRouter);
app.use('/admin/books',adminBooksRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})