import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import postRoute from './route/post.route.js';
import userRoute from './route/user.route.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
    ? true  
    : 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['set-cookie']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/posts', postRoute);
app.use('/api/users', userRoute);


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
});


const mongoEndpoint = process.env.MONGO_URI;
mongoose.connect(mongoEndpoint, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', () => {
    console.log('Successfully connected to MongoDB');
});

let frontend_dir = path.join(__dirname, '..', 'frontend', 'dist')
app.use(express.static(frontend_dir));
app.get('*', function (req, res) {           // 在所有环境都执行
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});