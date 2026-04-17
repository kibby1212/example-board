import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // 🐼 CORS 인증 정보를 포함하기 위한 설정
});

// 요청 인터셉터: 로컬 스토리지에서 토큰을 꺼내 헤더에 넣어줍니다.
api.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const { token } = JSON.parse(savedUser);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("토큰 파싱 에러! 🐼💦", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🐼 파일 전체에서 'export default'는 무조건 이 한 줄만 있어야 합니다!
export default api;