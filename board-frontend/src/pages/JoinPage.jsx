import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const JoinPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: ''
  });

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idError, setIdError] = useState('');

  const { username, password, nickname } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'username') {
      setIsIdChecked(false);
      setIdError('');
    }
  };

  const handleDuplicateCheck = async () => {
    if (!username) {
      alert("아이디를 입력해주세요! 🐼");
      return;
    }
    try {
      const res = await api.get(`/api/auth/check-username?username=${username}`);
      if (res.data === true) {
        setIdError('이미 사용 중인 아이디입니다. 😢');
        setIsIdChecked(false);
      } else {
        setIsIdChecked(true);
        setIdError('');
      }
    } catch (err) {
      alert('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isIdChecked) {
      alert("아이디 중복 확인을 먼저 해주세요! 🐼");
      return;
    }

    try {
      await api.post('/api/auth/join', formData);
      alert("회원가입 성공! 이제 로그인을 해볼까요? 🥳");
      navigate('/login');
    } catch (err) {
      alert("가입 실패: " + (err.response?.data || "다시 시도해주세요."));
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 min-h-screen bg-white">
      {/* 1. 헤더 섹션 */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-black uppercase">Join Us</h1>
        <p className="text-sm font-medium text-gray-400 mt-2 tracking-widest uppercase">
          Become a member of Panda Goshiwon
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 2. 아이디 입력 구역 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Username</label>
          <div className="flex gap-4">
            <input
              name="username"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={handleChange}
              required
              className="flex-1 border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200 font-medium"
            />
            <button 
              type="button" 
              onClick={handleDuplicateCheck}
              className="px-4 text-[11px] font-black border-2 border-black hover:bg-black hover:text-white transition-all active:scale-95"
            >
              CHECK
            </button>
          </div>
          {/* 에러/성공 메시지 */}
          {idError && <p className="text-[11px] text-red-500 font-bold ml-1">{idError}</p>}
          {isIdChecked && <p className="text-[11px] text-blue-500 font-bold ml-1">사용 가능한 아이디입니다.</p>}
        </div>

        {/* 3. 비밀번호 입력 구역 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={handleChange}
            required
            className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200"
          />
        </div>

        {/* 4. 닉네임 입력 구역 */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nickname</label>
          <input
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={handleChange}
            required
            className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200 font-medium"
          />
        </div>

        {/* 5. 제출 버튼 */}
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={!isIdChecked}
            className={`w-full py-4 text-sm font-black tracking-widest uppercase transition-all active:scale-[0.98]
              ${isIdChecked 
                ? 'bg-black text-white hover:bg-gray-800 shadow-xl shadow-black/10' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
          >
            Create Account
          </button>
          
          <p className="text-center mt-8 text-xs text-gray-400 font-medium">
            Already have an account? 
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              className="ml-2 text-black font-black underline underline-offset-4"
            >
              LOGIN
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default JoinPage;