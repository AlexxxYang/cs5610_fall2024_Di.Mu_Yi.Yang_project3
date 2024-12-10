import mongoose from "mongoose";
import { PostSchema } from './post.schema.js';

const PostModel = mongoose.model("Post", PostSchema);

export async function createPost(postData) {
    const post = await PostModel.create({
      content: postData.content.toString(),
      author: postData.author,
      image: postData.image
    });

  
  return PostModel.findById(post._id)
  .populate('author', 'username')
  .lean()
  .then(populatedPost => ({
    _id: populatedPost._id,
    content: populatedPost.content,
    author: populatedPost.author.username,
    image: populatedPost.image,
    createdAt: populatedPost.createdAt,
    updatedAt: populatedPost.updatedAt
  }));
}


export function getAllPosts() {
  return PostModel.find()
    .sort({ createdAt: -1 })
    .populate('author', 'username')
    .transform(documents => {
      return documents.map(doc => ({
        ...doc.toObject(),
        author: doc.author.username
      }));
    })
    .exec();
}

export async function getPostsByUser(userId) {
  return PostModel.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate('author', 'username')
    .transform(documents => {
      return documents.map(doc => ({
        ...doc.toObject(),
        author: doc.author.username
      }));
    });
}

export async function updatePost(postId, userId, content) {
  return PostModel.findOneAndUpdate(
    {
      _id: postId,
      author: userId  
    },
    {
      content: content,
      updatedAt: Date.now()
    },
    {
      new: true 
    }
  ).exec();
}

export async function deletePost(postId, userId) {
  return PostModel.findOneAndDelete({
    _id: postId,
    author: userId
  }).exec();
}