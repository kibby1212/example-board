// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가 (새로고침 시 깜빡임 방지)

  // 1. 로그인 함수: 서버가 준 DTO를 그대로 담습니다.
  // 서버 응답(data) 구조: { token: "...", username: "...", nickname: "..." }
  const login = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 2. 앱 시작 시 저장된 유저 정보 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // 데이터 확인 완료 후 로딩 해제
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} {/* 로딩 중에는 자식 컴포넌트를 렌더링하지 않음 */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);