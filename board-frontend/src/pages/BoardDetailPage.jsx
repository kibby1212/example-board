import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/comment/CommentSection";
import api from "../api/api";

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
      // 1. api.js에서 baseURL을 설정했으므로 '/api'를 중복해서 적지 않습니다.
      const res = await api.get(`/boards/${id}`);
      setBoard(res.data);
    } catch (err) {
      alert("글을 불러올 수 없습니다. 🐼");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    // 2. DTO의 isMember 필드로 판단합니다.
    if (!board.isMember) {
      const password = prompt("삭제 비밀번호를 입력하세요. 🐼");
      if (!password) return;
      
      try {
        await api.post(`/boards/${id}/delete`, { password });
        alert("삭제되었습니다! 🗑️");
        navigate("/");
      } catch (err) {
        alert(err.response?.data || "삭제 실패!");
      }
    } else {
      if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return;
      try {
        await api.delete(`/boards/${id}`);
        alert("삭제되었습니다! 🗑️");
        navigate("/");
      } catch (err) {
        alert("삭제 권한이 없습니다. 🐼");
      }
    }
  };

  const handleEdit = () => {
    if (board.isMember) {
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
      <header className="mb-16">
        <h1 className="text-5xl font-black tracking-tighter leading-tight mb-8 text-black">
          {board.title}
        </h1>
        
        <div className="flex justify-between items-center border-b border-gray-100 pb-8 text-sm">
          <div className="flex items-center gap-4 font-medium text-gray-400">
            {/* 3. 삼항 연산자 대신 서버가 합쳐준 nickname을 바로 씁니다. */}
            <span className="text-black font-bold">{board.nickname}</span>
            <span className="text-gray-200">|</span>
            <span>{new Date(board.createdAt).toLocaleString()}</span>
            <span className="text-gray-200">|</span>
            <span>조회수 {board.viewCount}</span>
          </div>

          {/* 4. 버튼 노출 로직 정리 */}
          <div className="flex gap-6 items-center uppercase tracking-widest font-black text-[11px]">
            {/* 회원글: 본인일 때만 노출 (백엔드 DTO에 authorUsername을 추가하면 더 정확한 체크가 가능합니다) 
               비회원글: 누구나 버튼은 보임 (클릭 시 비번 확인)
            */}
            {(board.isMember && user) || !board.isMember ? (
              <>
                <button onClick={handleEdit} className="hover:text-black transition-colors cursor-pointer text-gray-400">EDIT</button>
                <button onClick={handleDelete} className="hover:text-red-500 transition-colors cursor-pointer text-gray-200">DELETE</button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <article className="min-h-[400px] text-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-medium mb-24">
        {board.content}
      </article>

      <section className="border-t-2 border-black pt-16 mt-32">
        <div className="mb-10 flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 text-xs font-black">COMMENTS ({board.commentCount})</span>
        </div>
        <CommentSection boardId={id} />
      </section>

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