import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import postRoute from './route/post.route.js';
import userRoute from './route/user.route.js';
import { generateToken, decrypt } from './route/helpers/jwt.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// CORS 配置
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['set-cookie']
}));


// 其他中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/posts', postRoute);
app.use('/api/users', userRoute);

// 确保所有响应都包含正确的 CORS 头
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
});

// MongoDB 连接配置
const mongoEndpoint = process.env.MONGO_URI;
mongoose.connect(mongoEndpoint, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', () => {
    console.log('Successfully connected to MongoDB');
});

// 静态文件服务 - 前端构建文件
let frontend_dir = path.join(__dirname, 'dist')
console.log('Frontend directory:', frontend_dir);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(frontend_dir));
    app.get('*', function (req, res) {
        res.sendFile(path.join(frontend_dir, "index.html"));
    });
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});