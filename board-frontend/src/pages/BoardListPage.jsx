import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const BoardListPage = () => {
  const [boards, setBoards] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  // 1. 일반 목록 조회 (DTO 체제)
  const fetchBoards = async (page = 0) => {
    try {
      // page와 size를 파라미터로 보냅니다.
      const res = await api.get(`/boards?page=${page}&size=10`);

      if (res.data) {
        setBoards(res.data.content);
        // spring.data.web.page-serialization-mode=via_dto 설정 시 구조 주의!
        // 만약 위 설정을 했다면 res.data.page.totalPages로 접근해야 할 수도 있습니다.
        setTotalPages(res.data.totalPages || res.data.page?.totalPages || 0);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("목롤 로딩 실패 🐼", err);
    }
  };

  // 2. 검색 실행 로직
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!searchKeyword.trim()) {
      fetchBoards();
      return;
    }

    try {
      const res = await api.get(`/boards/search?keyword=${searchKeyword}`);
      // 검색 API도 Page<BoardResponseDto>를 반환하도록 설계했으므로 .content를 확인합니다.
      const searchResult = res.data.content || res.data;
      setBoards(searchResult);
    } catch (err) {
      console.error("검색 실패 🐼", err);
      alert("검색 결과를 가져오지 못했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-12 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-black uppercase">
            Board
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">
            🐼 Panda Goshiwon Community
          </p>
        </div>
        <button
          onClick={() => navigate("/write")}
          className="bg-black text-white px-8 py-2.5 text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
        >
          WRITE
        </button>
      </div>

      {/* 🔍 검색바 */}
      <div className="mb-10">
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="무엇을 찾고 싶으신가요? 🐼"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-all placeholder:text-gray-200 font-medium bg-transparent"
            />
            <span className="absolute right-0 top-2 text-gray-200 group-focus-within:text-black transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
          </div>
          <button
            type="submit"
            className="text-[11px] font-black uppercase tracking-widest border border-black px-5 py-2 hover:bg-black hover:text-white transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* 📄 게시글 목록 */}
      <div className="divide-y divide-gray-100">
        {boards.length > 0 ? (
          boards.map((b) => (
            <div
              key={b.id}
              onClick={() => navigate(`/board/${b.id}`)}
              className="group py-8 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 px-4 transition-all border-l-0 hover:border-l-4 hover:border-black"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {/* DTO에서 추가한 commentCount 활용 🐼💬 */}
                  {b.commentCount > 0 && (
                    <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-black">
                      {b.commentCount}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
                    {b.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                  {/* 3. 서버가 이미 처리해준 nickname을 바로 씁니다. 🦾 */}
                  <span className="text-black font-bold">{b.nickname}</span>
                  <span className="text-gray-100">|</span>
                  <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                  <span className="text-gray-100">|</span>
                  <span>조회 {b.viewCount}</span>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest text-xs">
            {searchKeyword ? "No results found. 🐼" : "The board is empty. 🐼"}
          </div>
        )}
      </div>
      {/* 🔢 페이징 UI */}
      <div className="flex justify-center items-center gap-2 mt-12">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => fetchBoards(i)}
            className={`px-3 py-1 text-sm font-bold transition-all ${
              currentPage === i
                ? "bg-black text-white"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoardListPage;
