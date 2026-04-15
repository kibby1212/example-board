// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. 로그인 함수: 데이터를 평평하게(Flatten) 폅니다.
  const login = (data) => {
    // 백엔드 구조: { user: { id, nickname... }, token: "..." }
    // 우리가 쓸 구조: { id, nickname, ..., token: "..." }
    const flattenedUser = {
      ...data.user,    // 유저 정보 싹 풀고
      token: data.token // 토큰을 같은 층에 합체!
    };

    setUser(flattenedUser);
    localStorage.setItem('user', JSON.stringify(flattenedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 새로고침 시에도 이미 평평해진 데이터를 읽어오므로 그대로 유지됩니다.
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);