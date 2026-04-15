// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소
});

// 토큰이 있다면 모든 요청 헤더에 자동으로 넣어주는 설정 (나중에 JWT 쓸 때 핵심!)
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;