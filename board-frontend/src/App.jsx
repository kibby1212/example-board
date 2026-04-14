import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  // --- 1. 상태 관리 (State) ---
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  // 게시판 입력 필드
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [password, setPassword] = useState('');

  // 댓글 입력 필드
  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentPw, setCommentPw] = useState('');

  // 회원가입/로그인 필드
  const [joinId, setJoinId] = useState('');
  const [joinPw, setJoinPw] = useState('');
  const [joinName, setJoinName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');

  // --- 2. useEffect (로그인 복구 및 데이터 로딩) ---
  useEffect(() => {
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) fetchComments(selectedBoard.id);
  }, [selectedBoard]);

  // --- 3. 데이터 통신 함수 (API) ---
  const fetchBoards = () => axios.get('http://localhost:8080/api/boards').then(res => setBoards(res.data.content));
  const fetchComments = (id) => axios.get(`http://localhost:8080/api/comments/${id}`).then(res => setComments(res.data));

  // 회원 서비스
  const handleJoin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/members/join', { loginId: joinId, password: joinPw, name: joinName })
      .then(res => { alert(res.data); setJoinId(''); setJoinPw(''); setJoinName(''); })
      .catch(err => alert("가입 실패: " + (err.response?.data || "서버 오류")));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/members/login', { loginId, password: loginPw })
      .then(res => {
        alert(`${res.data.name}님 환영합니다!`);
        setUser(res.data);
        localStorage.setItem('loggedUser', JSON.stringify(res.data));
        setLoginId(''); setLoginPw('');
      }).catch(() => alert("아이디 또는 비밀번호가 틀립니다."));
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem('loggedUser'); alert("로그아웃 되었습니다."); };

  // 게시글 CRUD
  const handleBoardSubmit = (e) => {
    e.preventDefault();
    const data = { title, content, authorName: user ? user.name : authorName, password: user ? user.password : password };
    axios.post('http://localhost:8080/api/boards', data).then(() => {
      setTitle(''); setContent(''); setAuthorName(''); setPassword(''); fetchBoards();
      alert("글이 등록되었습니다.");
    });
  };

  const handleDelete = (b) => {
    let pwd = (user && user.name === b.authorName) ? user.password : prompt("비밀번호 입력");
    if (pwd) axios.delete(`http://localhost:8080/api/boards/${b.id}?password=${pwd}`)
      .then(res => { alert(res.data); setSelectedBoard(null); fetchBoards(); })
      .catch(e => alert("삭제 실패: " + e.response.data));
  };

  const handleUpdate = () => {
    let pwd = (user && user.name === selectedBoard.authorName) ? user.password : prompt("비밀번호 입력");
    if (pwd) axios.put(`http://localhost:8080/api/boards/${selectedBoard.id}`, { ...selectedBoard, password: pwd })
      .then(() => { setIsEditing(false); fetchBoards(); alert("수정 완료!"); })
      .catch(e => alert("수정 실패: " + e.response.data));
  };

  // 댓글 CRUD
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const data = { content: commentContent, authorName: user ? user.name : commentAuthor, password: user ? user.password : commentPw };
    axios.post(`http://localhost:8080/api/comments/${selectedBoard.id}`, data)
      .then(() => { setCommentContent(''); setCommentAuthor(''); setCommentPw(''); fetchComments(selectedBoard.id); });
  };

  const handleCommentDelete = (c) => {
    let pwd = (user && user.name === c.authorName) ? user.password : prompt("비밀번호 입력");
    if (pwd) axios.delete(`http://localhost:8080/api/comments/${c.id}?password=${pwd}`)
      .then(() => fetchComments(selectedBoard.id)).catch(e => alert("권한 없음"));
  };

  // --- 4. 스타일 변수 ---
  const cardStyle = { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', padding: '25px', marginBottom: '30px' };
  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', width: '100%', boxSizing: 'border-box', fontSize: '14px' };
  const btnPrimary = { background: '#1a73e8', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' };

  return (
    <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Pretendard", "Noto Sans KR", sans-serif', color: '#333' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#1a73e8', margin: 0, fontSize: '28px', letterSpacing: '-1px' }}>Full-Stack Board</h1>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '15px' }}><strong>{user.name}</strong>님</span>
              <button onClick={handleLogout} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #dee2e6', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>로그아웃</button>
            </div>
          )}
        </header>

        {!user && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, color: '#1a73e8' }}>로그인</h3>
              <form onSubmit={handleLogin}>
                <input placeholder="아이디" style={inputStyle} value={loginId} onChange={e=>setLoginId(e.target.value)} required />
                <input type="password" placeholder="비밀번호" style={inputStyle} value={loginPw} onChange={e=>setLoginPw(e.target.value)} required />
                <button style={{ ...btnPrimary, width: '100%' }}>로그인</button>
              </form>
            </div>
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, color: '#34a853' }}>회원가입</h3>
              <form onSubmit={handleJoin}>
                <input placeholder="아이디" style={inputStyle} value={joinId} onChange={e=>setJoinId(e.target.value)} required />
                <input type="password" placeholder="비밀번호" style={inputStyle} value={joinPw} onChange={e=>setJoinPw(e.target.value)} required />
                <input placeholder="이름" style={inputStyle} value={joinName} onChange={e=>setJoinName(e.target.value)} required />
                <button style={{ ...btnPrimary, width: '100%', background: '#34a853' }}>가입하기</button>
              </form>
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>📝 새 포스트</h3>
          <form onSubmit={handleBoardSubmit}>
            {!user && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="작성자" style={inputStyle} value={authorName} onChange={e=>setAuthorName(e.target.value)} required />
                <input type="password" placeholder="글 비밀번호" style={inputStyle} value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
            )}
            <input placeholder="제목을 입력하세요" style={inputStyle} value={title} onChange={e=>setTitle(e.target.value)} required />
            <textarea placeholder="내용을 입력하세요" style={{ ...inputStyle, height: '120px', resize: 'none' }} value={content} onChange={e=>setContent(e.target.value)} required />
            <div style={{ textAlign: 'right' }}>
              <button style={btnPrimary}>게시물 등록</button>
            </div>
          </form>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>📋 게시글 목록</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f3f5', textAlign: 'left', color: '#888', fontSize: '14px' }}>
                <th style={{ padding: '15px' }}>ID</th>
                <th style={{ padding: '15px' }}>제목</th>
                <th style={{ padding: '15px' }}>작성자</th>
              </tr>
            </thead>
            <tbody>
              {boards.map(b => (
                <tr key={b.id} onClick={() => {setSelectedBoard(b); setIsEditing(false);}} 
                    style={{ borderBottom: '1px solid #f8f9fa', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f7ff' }
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent' }>
                  <td style={{ padding: '15px', color: '#999' }}>{b.id}</td>
                  <td style={{ padding: '15px', fontWeight: '500', color: '#1a73e8' }}>{b.title}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{b.authorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedBoard && (
          <div style={{ ...cardStyle, border: '1px solid #1a73e8', marginTop: '40px' }}>
            {isEditing ? (
              <div>
                <input style={inputStyle} value={selectedBoard.title} onChange={e=>setSelectedBoard({...selectedBoard, title:e.target.value})} />
                <textarea style={{ ...inputStyle, height: '250px' }} value={selectedBoard.content} onChange={e=>setSelectedBoard({...selectedBoard, content:e.target.value})} />
                <button onClick={handleUpdate} style={btnPrimary}>수정 완료</button>
                <button onClick={()=>setIsEditing(false)} style={{ ...btnPrimary, background: '#6c757d', marginLeft: '10px' }}>취소</button>
              </div>
            ) : (
              <div>
                <h2 style={{ marginTop: 0, marginBottom: '10px' }}>{selectedBoard.title}</h2>
                <div style={{ color: '#888', marginBottom: '25px', fontSize: '14px' }}>By <strong>{selectedBoard.authorName}</strong></div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#444', marginBottom: '30px', minHeight: '150px', background: '#fcfcfc', padding: '20px', borderRadius: '10px', border: '1px solid #f0f0f0' }}>
                  {selectedBoard.content}
                </div>
                {((!user) || (user && user.name === selectedBoard.authorName)) && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={()=>setIsEditing(true)} style={{ ...btnPrimary, background: '#f1f3f5', color: '#333' }}>수정</button>
                    <button onClick={()=>handleDelete(selectedBoard)} style={{ ...btnPrimary, background: '#fee2e2', color: '#ef4444' }}>삭제</button>
                  </div>
                )}
                <button onClick={()=>setSelectedBoard(null)} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>목록으로 돌아가기</button>
              </div>
            )}

            <div style={{ marginTop: '50px', borderTop: '2px solid #f1f3f5', paddingTop: '30px' }}>
              <h4 style={{ marginBottom: '20px' }}>💬 댓글 {comments.length}개</h4>
              {comments.map(c => (
                <div key={c.id} style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><strong>{c.authorName}</strong> <span style={{ marginLeft: '15px', color: '#555' }}>{c.content}</span></div>
                  {((!user) || (user && user.name === c.authorName)) && (
                    <button onClick={()=>handleCommentDelete(c)} style={{ color: '#ff4d4f', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                  )}
                </div>
              ))}
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                {!user && (
                  <>
                    <input placeholder="이름" style={{ ...inputStyle, width: '120px', marginBottom: 0 }} value={commentAuthor} onChange={e=>setCommentAuthor(e.target.value)} required />
                    <input type="password" placeholder="비밀번호" style={{ ...inputStyle, width: '120px', marginBottom: 0 }} value={commentPw} onChange={e=>setCommentPw(e.target.value)} required />
                  </>
                )}
                <input placeholder="댓글을 입력하세요..." style={{ ...inputStyle, flex: 1, marginBottom: 0 }} value={commentContent} onChange={e=>setCommentContent(e.target.value)} required />
                <button style={{ ...btnPrimary, background: '#333' }}>등록</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;