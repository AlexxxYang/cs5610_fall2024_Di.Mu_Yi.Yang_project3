import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// 使用环境变量中的密钥，如果没有则使用默认值
const SECRET_KEY = process.env.JWT_SECRET || "secret-key";

export function generateToken(payload) {
    return jwt.sign({payload}, SECRET_KEY, {
        expiresIn: '14d'
    });
}

export function decrypt(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        return decoded.payload;
    } catch (err) {
        return false;
    }
}

