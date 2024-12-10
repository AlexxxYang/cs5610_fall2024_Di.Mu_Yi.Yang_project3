import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: ''
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'users' });

UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});