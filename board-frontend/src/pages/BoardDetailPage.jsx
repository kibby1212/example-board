import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/comment/CommentSection";
import api from "../services/api";

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/api/boards/${id}`);
      setBoard(res.data);
    } catch (err) {
      alert("글을 불러올 수 없습니다.");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    let password = null;
    if (!board.user) {
      password = prompt("삭제 비밀번호를 입력하세요. 🐼");
      if (!password) return;
    } else {
      if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return;
    }

    try {
      if (!board.user) {
        await api.post(`/api/boards/${id}/delete`, { password });
      } else {
        await api.delete(`/api/boards/${id}`);
      }
      alert("삭제되었습니다! 🗑️");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "삭제 실패!");
    }
  };

  const handleEdit = () => {
    if (board.user) {
      navigate(`/edit/${id}`);
    } else {
      const password = prompt("글 작성 시 입력한 비밀번호를 입력해 주세요.");
      if (password) {
        navigate(`/edit/${id}`, { state: { guestPassword: password } });
      }
    }
  };

  if (!board) return (
    <div className="flex justify-center items-center h-screen font-black text-gray-200">
      LOADING PANDA... 🐼
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-white min-h-screen">
      {/* 1. 상단 정보 섹션 */}
      <header className="mb-16">
        <h1 className="text-5xl font-black tracking-tighter leading-tight mb-8 text-black">
          {board.title}
        </h1>
        
        <div className="flex justify-between items-center border-b border-gray-100 pb-8 text-sm">
          <div className="flex items-center gap-4 font-medium text-gray-400">
            <span className="text-black font-bold">
              {board.user ? board.user.nickname : board.guestNickname}
            </span>
            <span className="text-gray-200">|</span>
            <span>{new Date(board.createdAt).toLocaleString()}</span>
          </div>

          {/* 수정/삭제 버튼 그룹 (조건부 렌더링) */}
          <div className="flex gap-6 items-center uppercase tracking-widest font-black text-[11px]">
            {/* 회원 작성자용 */}
            {user && board.user && user.id === board.user.id && (
              <>
                <button onClick={handleEdit} className="hover:text-black transition-colors cursor-pointer text-gray-400">EDIT</button>
                <button onClick={handleDelete} className="hover:text-red-500 transition-colors cursor-pointer text-gray-200">DELETE</button>
              </>
            )}
            {/* 비회원용 */}
            {!user && !board.user && (
              <>
                <button onClick={handleEdit} className="hover:text-black transition-colors cursor-pointer text-gray-400">EDIT</button>
                <button onClick={handleDelete} className="hover:text-red-500 transition-colors cursor-pointer text-gray-200">DELETE</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. 본문 섹션 */}
      <article className="min-h-[400px] text-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-medium mb-24">
        {board.content}
      </article>

      {/* 3. 댓글 섹션 (판다 스타일 구분선) */}
      <section className="border-t-2 border-black pt-16 mt-32">
        <div className="mb-10 flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 text-xs font-black">COMMENTS</span>
        </div>
        <CommentSection boardId={id} />
      </section>

      {/* 4. 하단 네비게이션 */}
      <footer className="mt-20 flex justify-center">
        <button 
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 border-2 border-black px-10 py-4 font-black text-sm hover:bg-black hover:text-white transition-all active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="rotate-180">
            <path d="M5 12h14m-7-7 7 7-7 7"/>
          </svg>
          BACK TO LIST
        </button>
      </footer>
    </div>
  );
};

export default BoardDetailPage;