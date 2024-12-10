import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
    // 移除默认的 Content-Type，让 axios 根据数据类型自动设置
  }
});

// 添加调试拦截器
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.log('Response Error:', error);
    return Promise.reject(error);
  }
);

export const auth = {
  register: (userData) => api.post('/users/signup', userData),
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => api.post('/users/logout'),
  validate: () => api.get('/users/validate-token') // 新添加的方法
};

export const posts = {
  getAll: () => api.get('/posts'),
  getUserPosts: (username) => api.get(`/posts/user/${username}`),
  create: (formData) => {
    // 确保不覆盖 Content-Type，让浏览器自动设置正确的 boundary
    return api.post('/posts', formData);
  },
  update: (postId, content) => api.put(`/posts/${postId}`, { content }),
  delete: (postId) => api.delete(`/posts/${postId}`)
};

export const users = {
  search: (term) => api.get(`/users/search/${term}`),
  getProfile: (username) => api.get(`/users/${username}`)
};
