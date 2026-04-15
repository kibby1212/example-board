import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const BoardForm = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [guestNickname, setGuestNickname] = useState('');
  // 수정 시에는 기존 비번을 넘겨받거나 새로 입력받습니다.
  const initialPassword = location.state?.guestPassword || '';
  const [guestPassword, setGuestPassword] = useState(initialPassword);

  useEffect(() => {
    if (isEdit && id) {
      // 1. api.js 설정 덕분에 '/api'를 뺍니다.
      api.get(`/boards/${id}`)
        .then(res => {
          // BoardResponseDto에서 필요한 필드만 추출
          const { title, content } = res.data;
          setTitle(title);
          setContent(content);
        })
        .catch(() => {
          alert("데이터를 불러오지 못했습니다. 🐼");
          navigate('/');
        });
    }
  }, [isEdit, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. 백엔드 DTO 규격에 맞게 데이터 구성
    // CreateRequestDto & UpdateRequestDto 공통 필드
    const boardData = { title, content };

    // 비회원일 경우에만 보안 관련 필드 추가
    if (!user) {
      boardData.guestPassword = guestPassword;
      if (!isEdit) {
        boardData.guestNickname = guestNickname;
      }
    }

    try {
      if (isEdit) {
        // PUT /boards/{id} -> BoardUpdateRequestDto 매핑
        await api.put(`/boards/${id}`, boardData);
        alert("성공적으로 수정되었습니다! 🐼🦾");
        navigate(`/board/${id}`);
      } else {
        // POST /boards -> BoardCreateRequestDto 매핑
        await api.post('/boards', boardData);
        alert("글이 등록되었습니다! ✍️");
        navigate('/');
      }
    } catch (err) {
      // 백엔드 RuntimeException 메시지를 그대로 보여줍니다.
      const errorMsg = err.response?.data || (isEdit ? "수정 실패!" : "등록 실패!");
      alert(errorMsg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen bg-white">
      <header className="mb-16 border-b-2 border-black pb-8">
        <h1 className="text-5xl font-black tracking-tighter text-black uppercase">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
        <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">
          {isEdit ? `Editing content for board #${id}` : "Share your thoughts in Panda Goshiwon"}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* 비회원 정보 입력: 작성 시에만 닉네임 노출, 수정 시에는 비번만 필요할 수 있음 */}
        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {!isEdit && (
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nickname</label>
                <input 
                  placeholder="닉네임을 입력하세요" 
                  value={guestNickname} 
                  onChange={e => setGuestNickname(e.target.value)} 
                  required 
                  className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200 font-medium" 
                />
              </div>
            )}
            <div className={`space-y-2 ${isEdit ? 'col-span-2' : ''}`}>
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                {isEdit ? "Confirm Password" : "Password"}
              </label>
              <input 
                type="password" 
                placeholder="비밀번호를 입력하세요" 
                value={guestPassword} 
                onChange={e => setGuestPassword(e.target.value)} 
                required 
                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200" 
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Title</label>
          <input 
            placeholder="제목을 입력하세요" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
            className="w-full border-b border-gray-200 py-4 text-3xl font-bold focus:border-black outline-none transition-all placeholder:text-gray-100 tracking-tight" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Content</label>
          <textarea 
            placeholder="어떤 이야기를 들려주실 건가요?" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            required 
            className="w-full min-h-[450px] border border-gray-100 p-8 text-lg leading-relaxed focus:border-black outline-none transition-all placeholder:text-gray-200 resize-none font-medium" 
          />
        </div>

        <div className="flex justify-end items-center gap-8 pt-6">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="text-sm font-black text-gray-300 hover:text-black transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-black text-white px-14 py-4 text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/5 uppercase tracking-widest"
          >
            {isEdit ? "Save Changes" : "Post it now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardForm;