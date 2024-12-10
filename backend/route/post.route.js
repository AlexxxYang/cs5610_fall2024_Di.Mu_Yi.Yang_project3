import express from 'express';
import * as postModel from './db/post.model.js';
import * as userModel from './db/user.model.js';
import * as jwtHelpers from './helpers/jwt.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { uploadToS3 } from '../config/s3.js';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const requireAuth = (req, res, next) => {
  const username = jwtHelpers.decrypt(req.cookies.token);
  if (!username) {
    res.status(401).send('Authentication required');
    return;
  }
  req.username = username;
  next();
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 获取所有帖子
router.get('/', async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error getting all posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// 获取特定用户的帖子
router.get('/user/:username', async (req, res) => {
  try {
    const user = await userModel.findUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = await postModel.getPostsByUser(user._id);
    res.json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const user = await userModel.findUserByUsername(req.username);
    if (!user) {
      return res.status(401).send('User not found');
    }

    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadToS3(req.file);
        console.log('Uploaded image to S3:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image to S3:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    }

    const postData = {
      content: req.body.content || '',
      author: user._id,
      image: imageUrl
    };

    const post = await postModel.createPost(postData);
    res.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(400).json({ error: error.message });
  }
});

// 更新帖子
router.put('/:postId', requireAuth, async (req, res) => {
  try {
    console.log('Update request received:', {
      postId: req.params.postId,
      content: req.body.content,
      username: req.username
    });

    const user = await userModel.findUserByUsername(req.username);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const updatedPost = await postModel.updatePost(
      req.params.postId,
      user._id,
      req.body.content
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除帖子
router.delete('/:postId', requireAuth, async (req, res) => {
  try {
    console.log('Delete request received:', {
      postId: req.params.postId,
      username: req.username
    });

    const user = await userModel.findUserByUsername(req.username);
    if (!user) {
      console.log('User not found:', req.username);
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('Found user:', {
      userId: user._id,
      username: user.username
    });

    const deletedPost = await postModel.deletePost(
      req.params.postId,
      user._id
    );

    console.log('Delete result:', deletedPost);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.json({ 
      message: 'Post deleted successfully', 
      postId: req.params.postId 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
