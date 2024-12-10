import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
    
  }
});

export const auth = {
  register: (userData) => api.post('/users/signup', userData),
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => api.post('/users/logout'),
  validate: () => api.get('/users/validate-token') 
};

export const posts = {
  getAll: () => api.get('/posts'),
  getUserPosts: (username) => api.get(`/posts/user/${username}`),
  create: (formData) => {
    return api.post('/posts', formData);
  },
  update: (postId, content) => api.put(`/posts/${postId}`, { content }),
  delete: (postId) => api.delete(`/posts/${postId}`)
};

export const users = {
  search: (term) => api.get(`/users/search/${term}`),
  getProfile: (username) => api.get(`/users/${username}`)
};
