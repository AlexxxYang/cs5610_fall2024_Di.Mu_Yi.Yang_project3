import express from 'express';
import * as postModel from './db/post.model.js';
import * as userModel from './db/user.model.js';
import * as jwtHelpers from './helpers/jwt.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadToS3 } from '../config/s3.js';


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


router.get('/', async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


router.get('/user/:username', async (req, res) => {
  try {
    const user = await userModel.findUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = await postModel.getPostsByUser(user._id);
    res.json(userPosts);
  } catch (error) {
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
      } catch (uploadError) {
        
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
    
    res.status(400).json({ error: error.message });
  }
});


router.put('/:postId', requireAuth, async (req, res) => {
  try {
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
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:postId', requireAuth, async (req, res) => {
  try {
    const user = await userModel.findUserByUsername(req.username);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const deletedPost = await postModel.deletePost(
      req.params.postId,
      user._id
    );

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.json({ 
      message: 'Post deleted successfully', 
      postId: req.params.postId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
