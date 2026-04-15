import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { username, password });
      login(res.data); // 토큰과 유저 정보를 컨텍스트에 저장
      alert("환영합니다! 🐼");
      navigate('/');
    } catch (err) {
      alert("로그인 실패: 아이디나 비번을 확인하세요.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-32 min-h-screen bg-white">
      {/* 1. 상단 헤더: 판다 로고 스타일 */}
      <header className="mb-16 text-center">
        <h1 
          className="text-5xl font-black tracking-tighter text-black uppercase cursor-pointer mb-2"
          onClick={() => navigate('/')}
        >
          Panda.
        </h1>
        <p className="text-sm font-medium text-gray-400 tracking-[0.3em] uppercase ml-1">
          Welcome Back
        </p>
      </header>

      <form onSubmit={handleLogin} className="space-y-12">
        {/* 2. 아이디 입력 구역 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Username</label>
          <input 
            type="text" 
            placeholder="아이디를 입력하세요" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200 font-medium" 
          />
        </div>

        {/* 3. 비밀번호 입력 구역 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Password</label>
          <input 
            type="password" 
            placeholder="비밀번호를 입력하세요" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200" 
          />
        </div>

        {/* 4. 로그인 버튼 및 부가 링크 */}
        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full bg-black text-white py-4 text-sm font-black tracking-widest uppercase hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
          >
            Sign In
          </button>
          
          <div className="flex flex-col items-center gap-6 mt-10">
            <p className="text-xs text-gray-400 font-medium">
              New to Panda Goshiwon? 
              <button 
                type="button" 
                onClick={() => navigate('/join')}
                className="ml-3 text-black font-black underline underline-offset-4 decoration-1"
              >
                CREATE ACCOUNT
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;