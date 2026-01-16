import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { connectDB } from './configs/mongodb.js';
import adminStudentRouter from './routes/admin/adminStudentRoute.js';
import adminTeacherRouter from './routes/admin/adminTeacherRoute.js';
import adminLoginRouter from './routes/admin/adminLoginRoute.js';
const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.get('/', (req,res) => {
    res.send("Hello, World !");
});

app.use('/admin',adminStudentRouter);
app.use('/admin',adminTeacherRouter);
app.use('/',adminLoginRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})