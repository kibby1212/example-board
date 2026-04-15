import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다. 🐼");
    navigate('/'); 
  };

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* 1. 로고 섹션: PANDA. */}
        <Link 
          to="/" 
          className="text-2xl font-black tracking-tighter text-black hover:opacity-70 transition-opacity"
        >
          PANDA.
        </Link>

        {/* 2. 오른쪽 메뉴 섹션 */}
        <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
          {user ? (
            <>
              {/* 유저 닉네임: 포인트 컬러(블랙) */}
              <span className="text-black border-b-2 border-black pb-0.5">
                {user.nickname}
              </span>
              
              {/* 로그아웃 버튼: 회색에서 블랙으로 호버 */}
              <button 
                onClick={handleLogout}
                className="text-gray-300 hover:text-black transition-colors cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              {/* 로그인 링크 */}
              <Link 
                to="/login" 
                className="text-gray-400 hover:text-black transition-colors"
              >
                LOGIN
              </Link>
              
              {/* 회원가입 버튼: 블랙 박스 스타일 */}
              <Link 
                to="/join" 
                className="bg-black text-white px-5 py-2 hover:bg-gray-800 transition-all active:scale-95"
              >
                JOIN
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;