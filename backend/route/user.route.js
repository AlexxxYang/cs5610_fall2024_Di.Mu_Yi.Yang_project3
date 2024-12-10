import express from 'express';
import bcrypt from 'bcrypt';
import * as userModel from './db/user.model.js';
import * as jwtHelpers from './helpers/jwt.js';

const router = express.Router();

router.get('/validate-token', async (req, res) => {
    try {
      const username = jwtHelpers.decrypt(req.cookies.token);
      if (!username) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      const user = await userModel.findUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      res.json({ valid: true });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  router.get('/:username', async (req, res) => {
    try {
        const user = await userModel.findUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        
        res.json({
            username: user.username,
            joinedAt: user.joinedAt,
            description: user.description,
            status: user.status
        });
    } catch (error) {
      
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

router.post('/signup', async (req, res) => {
 
    try {
        const user = await userModel.createUser({
            username: req.body.username,
            password: req.body.password
        });
        
        const token = jwtHelpers.generateToken(user.username);
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Signup successful' });
    } catch (error) {
       
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userModel.findUserByUsername(username); 
        
        if (!user || !await userModel.verifyPassword(user, password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwtHelpers.generateToken(user.username);
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.json({
            username: user.username,
            _id: user._id
        });
    } catch (error) {

        res.status(500).json({ error: 'Server error during login' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
});

router.put('/status', async (req, res) => {
    try {
        const username = jwtHelpers.decrypt(req.cookies.token);
        if (!username) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const updatedUser = await userModel.updateUserStatus(username, req.body.status);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ status: updatedUser.status });
    } catch (error) {
       
        res.status(500).json({ error: 'Failed to update status' });
    }
});

router.get('/search/:term', async (req, res) => {
    try {
      const users = await userModel.searchUsers(req.params.term);
      res.json(users);
    } catch (error) {

      res.status(500).json({ error: 'Failed to search users' });
    }
  });
  
export default router;