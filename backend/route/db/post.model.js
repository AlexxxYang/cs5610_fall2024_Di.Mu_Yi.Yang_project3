import mongoose from "mongoose";
import { PostSchema } from './post.schema.js';

const PostModel = mongoose.model("Post", PostSchema);

export async function createPost(postData) {
    const post = await PostModel.create({
      content: postData.content.toString(),
      author: postData.author,
      image: postData.image
    });

  // 再次查询并填充作者信息
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

export async function uploadImage(imageData) {
  // 这里需要实现图片上传的逻辑,并返回上传后的 URL
  // 例如,可以使用第三方服务如 AWS S3 或 Cloudinary 来上传图片
  // 出于演示目的,这里暂时返回一个示例 URL
  return 'https://example.com/uploaded-image.jpg';
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
      author: userId  // 确保只有作者能更新
    },
    {
      content: content,
      updatedAt: Date.now()
    },
    {
      new: true // 返回更新后的文档
    }
  ).exec();
}

export async function deletePost(postId, userId) {
  console.log('Attempting to delete post:', {
    postId,
    userId,
    postIdType: typeof postId,
    userIdType: typeof userId
  });

  // 先查找帖子看看是否存在
  const post = await PostModel.findById(postId);
  console.log('Found post:', post);
  console.log('Post author:', post?.author);
  console.log('User ID:', userId);
  console.log('Types:', {
    authorType: typeof post?.author,
    userIdType: typeof userId
  });

  const result = await PostModel.findOneAndDelete({
    _id: postId,
    author: userId
  }).exec();

  console.log('Delete result:', result);
  return result;
}