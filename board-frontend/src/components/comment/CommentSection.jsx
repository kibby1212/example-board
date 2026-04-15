import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CommentSection = ({ boardId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [guestNickname, setGuestNickname] = useState('');
  const [guestPassword, setGuestPassword] = useState('');

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/comments/${boardId}`);
      setComments(res.data);
    } catch (err) {
      console.error("댓글 로딩 실패", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      content,
      guestNickname: !user ? guestNickname : null,
      guestPassword: !user ? guestPassword : null
    };
    try {
      await api.post(`/api/comments/${boardId}`, data);
      setContent(''); 
      setGuestNickname(''); 
      setGuestPassword('');
      fetchComments();
    } catch (err) {
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleDelete = async (comment) => {
    if (comment.user) {
      if (window.confirm("댓글을 삭제하시겠습니까?")) {
        await api.delete(`/api/comments/${comment.id}`);
        fetchComments();
      }
    } else {
      const pw = prompt("비밀번호를 입력하세요 🐼");
      if (pw) {
        try {
          await api.post(`/api/comments/${comment.id}/delete`, { password: pw });
          fetchComments();
        } catch (err) { 
          alert("비밀번호가 틀렸습니다."); 
        }
      }
    }
  };

  return (
    <div className="mt-12 w-full">
      {/* 1. 헤더: 댓글 수 표시 */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-black uppercase tracking-[0.3em] bg-black text-white px-2 py-1">
          Comments
        </span>
        <span className="text-sm font-bold text-gray-400">({comments.length})</span>
      </div>

      {/* 2. 댓글 목록 */}
      <div className="space-y-8 mb-16">
        {comments.length > 0 ? (
          comments.map(c => (
            <div key={c.id} className="group border-b border-gray-50 pb-6 last:border-0 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* 작성자 정보 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-black text-black">
                      {c.user ? c.user.nickname : (c.guestNickname || "익명")}
                    </span>
                    <span className="text-[10px] text-gray-300 font-medium">
                      {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  {/* 댓글 내용 */}
                  <p className="text-gray-700 text-base leading-relaxed font-medium">
                    {c.content}
                  </p>
                </div>

                {/* 삭제 버튼: 호버 시에만 선명하게 */}
                {((!c.user) || (user && c.user.id === user.id)) && (
                  <button 
                    onClick={() => handleDelete(c)} 
                    className="text-gray-200 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    title="Delete"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-xs font-bold text-gray-200 uppercase tracking-widest">
            No comments yet. Be the first! 🐼
          </div>
        )}
      </div>

      {/* 3. 댓글 입력 폼: 하단 고정 느낌 */}
      <form onSubmit={handleSubmit} className="bg-gray-50/50 p-8 border border-gray-100">
        <div className="space-y-6">
          {/* 비회원용 입력창 */}
          {!user && (
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="NICKNAME" 
                value={guestNickname} 
                onChange={e => setGuestNickname(e.target.value)} 
                required 
                className="bg-transparent border-b border-gray-200 py-2 text-xs font-bold focus:border-black outline-none transition-all placeholder:text-gray-300" 
              />
              <input 
                type="password" 
                placeholder="PASSWORD" 
                value={guestPassword} 
                onChange={e => setGuestPassword(e.target.value)} 
                required 
                className="bg-transparent border-b border-gray-200 py-2 text-xs font-bold focus:border-black outline-none transition-all placeholder:text-gray-300" 
              />
            </div>
          )}

          {/* 메인 입력창 + 버튼 */}
          <div className="flex flex-col gap-4">
            <textarea 
              placeholder="댓글을 입력하세요..." 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              required 
              rows="3"
              className="w-full bg-white border border-gray-200 p-4 text-sm font-medium focus:border-black outline-none transition-all resize-none placeholder:text-gray-200" 
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-black text-white px-8 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
              >
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;