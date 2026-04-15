import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BoardListPage = () => {
  const [boards, setBoards] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(''); // 🔍 검색어 상태
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  // 1. 일반 목록 조회
  const fetchBoards = async () => {
    try {
      const res = await api.get('/api/boards');
      if (res.data && res.data.content) {
        setBoards(res.data.content);
      } else {
        setBoards([]);
      }
    } catch (err) {
      console.error("목록 로딩 실패:", err);
    }
  };

  // 2. 검색 실행 로직
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    // 검색어가 없으면 전체 목록을 불러옵니다.
    if (!searchKeyword.trim()) {
      fetchBoards();
      return;
    }

    try {
      const res = await api.get(`/api/boards/search?keyword=${searchKeyword}`);
      // 백엔드 검색 API도 페이징 형식을 반환한다면 .content를 사용하세요.
      // 만약 그냥 배열을 반환한다면 res.data를 바로 넣으시면 됩니다.
      const searchResult = res.data.content || res.data;
      setBoards(searchResult);
    } catch (err) {
      console.error("검색 실패:", err);
      alert("검색 결과를 가져오지 못했습니다. 😢");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* --- 헤더 섹션 --- */}
      <div className="flex justify-between items-end mb-12 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-black">BOARD</h1>
          <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">
            🐼 Panda Goshiwon Community
          </p>
        </div>
        <button 
          onClick={() => navigate('/write')}
          className="bg-black text-white px-8 py-2.5 text-sm font-black hover:bg-gray-800 transition-all active:scale-95"
        >
          WRITE
        </button>
      </div>

      {/* --- 🔍 검색바 섹션 (Panda 스타일) --- */}
      <div className="mb-10">
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="검색어를 입력하세요..." 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-all placeholder:text-gray-200 font-medium"
            />
            {/* 검색 아이콘 (장식용) */}
            <span className="absolute right-0 top-2 text-gray-200 group-focus-within:text-black transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
          </div>
          <button 
            type="submit"
            className="text-[11px] font-black uppercase tracking-widest border border-black px-5 py-2 hover:bg-black hover:text-white transition-all"
          >
            SEARCH
          </button>
        </form>
      </div>

      {/* --- 게시글 목록 섹션 --- */}
      <div className="divide-y divide-gray-100">
        {boards.length > 0 ? (
          boards.map((b) => (
            <div 
              key={b.id} 
              onClick={() => navigate(`/board/${b.id}`)}
              className="group py-6 flex justify-between items-center cursor-pointer hover:bg-gray-50/80 px-4 transition-all"
            >
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 group-hover:underline decoration-2 underline-offset-8">
                  {b.title}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-400 font-medium">
                  <span className="text-black">
                    {b.user ? b.user.nickname : (b.guestNickname || "익명")}
                  </span>
                  <span className="text-gray-200">|</span>
                  <span>{new Date(b.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">
            {searchKeyword ? "No results found for your search. 🐼" : "No posts yet. 🐼"}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardListPage;