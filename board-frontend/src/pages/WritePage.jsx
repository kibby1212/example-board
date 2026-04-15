import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const WritePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [guestNickname, setGuestNickname] = useState('');
  const [guestPassword, setGuestPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      content,
      // 유저가 없으면 비회원 데이터 포함
      guestNickname: !user ? guestNickname : null,
      guestPassword: !user ? guestPassword : null
    };

    try {
      await api.post('/api/boards', data);
      alert("글이 등록되었습니다! ✍️");
      navigate('/');
    } catch (err) {
      alert("등록 실패!");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>✍️ 새 글 작성</h2>
      <form onSubmit={handleSubmit}>
        {!user && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input placeholder="익명 닉네임" value={guestNickname} onChange={e => setGuestNickname(e.target.value)} required style={{ flex: 1, padding: '10px' }} />
            <input type="password" placeholder="비밀번호" value={guestPassword} onChange={e => setGuestPassword(e.target.value)} required style={{ flex: 1, padding: '10px' }} />
          </div>
        )}
        <input placeholder="제목" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <textarea placeholder="내용을 입력하세요" value={content} onChange={e => setContent(e.target.value)} required style={{ width: '100%', height: '200px', padding: '10px', marginBottom: '10px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#333', color: 'white' }}>등록하기</button>
      </form>
    </div>
  );
};

export default WritePage;