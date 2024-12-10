import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserSchema } from './user.schema.js';

const UserModel = mongoose.model("User", UserSchema);

export async function createUser(user) {
    return UserModel.create(user);
}

export async function findUserByUsername(username) {
    return UserModel.findOne({ username: username }).exec();
}

export async function updateUserDescription(userId, description) {
    return UserModel.findByIdAndUpdate(
        userId,
        { description: description },
        { new: true }
    ).exec();
}

export async function updateUserStatus(username, status) {
    return UserModel.findOneAndUpdate(
        { username: username },
        { status: status },
        { new: true }
    ).exec();
}

export async function searchUsers(searchTerm) {
    return UserModel.find({
      username: { 
        $regex: searchTerm, 
        $options: 'i' // case-insensitive
      }
    })
    .select('username joinedAt description') // Only select needed fields
    .exec();
  }

export async function verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
}