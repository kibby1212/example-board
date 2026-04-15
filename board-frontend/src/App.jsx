// import React, { useEffect, useState } from "react";
// // --- dayjs 관련 설정 ---
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import "dayjs/locale/ko";
// import api from "./api";

// dayjs.extend(relativeTime);
// dayjs.locale("ko");

// function App() {
//   // --- 1. 상태 관리 (State) ---
//   const [boards, setBoards] = useState([]);
//   const [selectedBoard, setSelectedBoard] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [comments, setComments] = useState([]);

//   // 새로고침 시 로그인 유지 (Lazy Initialization)
//   const [user, setUser] = useState(() => {
//     const token = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("loggedUser");
//     return token && savedUser ? JSON.parse(savedUser) : null;
//   });

//   // 게시판 입력 필드 (비회원용 nickname, password 사용)
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [nickname, setNickname] = useState("");
//   const [password, setPassword] = useState("");

//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // 댓글 입력 필드
//   const [commentContent, setCommentContent] = useState("");
//   const [commentAuthor, setCommentAuthor] = useState("");
//   const [commentPw, setCommentPw] = useState("");

//   // 회원가입/로그인 필드
//   const [joinId, setJoinId] = useState("");
//   const [joinPw, setJoinPw] = useState("");
//   const [joinName, setJoinName] = useState("");
//   const [loginId, setLoginId] = useState("");
//   const [loginPw, setLoginPw] = useState("");

//   // --- 2. useEffect ---
//   useEffect(() => {
//     if (selectedBoard) fetchComments(selectedBoard.id);
//   }, [selectedBoard]);

//   useEffect(() => {
//     fetchBoards(currentPage);
//   }, [currentPage]);

//   // --- 3. 데이터 통신 함수 (API) ---
//   const fetchBoards = (page = 0) => {
//     api.get(`/api/boards?page=${page}`).then((res) => {
//       setBoards(res.data.content);
//       setTotalPages(res.data.totalPages);
//       setCurrentPage(res.data.number);
//     });
//   };

//   const fetchComments = (id) =>
//     api.get(`api/comments/${id}`).then((res) => setComments(res.data));

//   const handleJoin = (e) => {
//     e.preventDefault();
//     api
//       .post("/api/auth/signup", {
//         username: joinId,
//         password: joinPw,
//         nickname: joinName,
//       })
//       .then((res) => {
//         alert(res.data);
//         setJoinId("");
//         setJoinPw("");
//         setJoinName("");
//       })
//       .catch((err) =>
//         alert("가입 실패: " + (err.response?.data || "서버 오류")),
//       );
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     api
//       .post("/api/auth/login", { username: loginId, password: loginPw })
//       .then((res) => {
//         alert(`${res.data.user.nickname}님 환영합니다! 🐼`);
//         setUser(res.data.user);
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("loggedUser", JSON.stringify(res.data.user));
//         setLoginId("");
//         setLoginPw("");
//       })
//       .catch(() => alert("아이디 또는 비밀번호가 틀립니다."));
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     setUser(null);
//     alert("로그아웃 되었습니다. 🦾");
//   };

//   const handleBoardSubmit = (e) => {
//     if (e) e.preventDefault();

//     // 비회원 검증
//     if (!user && (!nickname || !password)) {
//       alert("작성자와 비밀번호를 입력해주세요!");
//       return;
//     }

//     const newBoard = {
//       title,
//       content,
//       // UI의 nickname을 백엔드의 guestNickname으로 매핑
//       guestNickname: !user ? nickname : null,
//       guestPassword: !user ? password : null,
//     };

//     api
//       .post("/api/boards", newBoard)
//       .then(() => {
//         alert("글이 등록되었습니다! 🐼");
//         setTitle("");
//         setContent("");
//         setNickname("");
//         setPassword("");
//         fetchBoards();
//       })
//       .catch((err) => alert("글쓰기 실패: " + err.response?.data));
//   };

//   const handleBoardDetail = (id) => {
//     api.get(`/api/boards/${id}`).then((res) => {
//       setSelectedBoard(res.data);
//       setIsEditing(false);
//       fetchBoards(currentPage);
//     });
//   };

//   const handleDelete = (id) => {
//     if (!window.confirm("정말 삭제하시겠습니까?")) return;
//     api
//       .delete(`/api/boards/${id}`)
//       .then((res) => {
//         alert(res.data);
//         setSelectedBoard(null);
//         fetchBoards();
//       })
//       .catch((err) =>
//         alert("삭제 실패: " + (err.response?.data || "권한이 없습니다.")),
//       );
//   };

//   const handleUpdate = () => {
//     api
//       .put(`/api/boards/${selectedBoard.id}`, selectedBoard)
//       .then(() => {
//         setIsEditing(false);
//         fetchBoards();
//         alert("수정 완료!");
//       })
//       .catch((e) => alert("수정 실패: " + e.response.data));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchKeyword.trim()) {
//       fetchBoards();
//       return;
//     }
//     api
//       .get(`/api/boards/search?keyword=${searchKeyword}`)
//       .then((res) => setBoards(res.data.content))
//       .catch(() => alert("검색 실패"));
//   };

//   const handleCommentSubmit = (e) => {
//     e.preventDefault();

//     // 백엔드 엔티티 필드명에 맞춰서 데이터 구성
//     const data = {
//       content: commentContent,
//       // 로그인 안 했을 때만 비회원 정보를 실어 보냅니다.
//       guestNickname: !user ? commentAuthor : null,
//       guestPassword: !user ? commentPw : null,
//     };

//     api
//       .post(`/api/comments/${selectedBoard.id}`, data)
//       .then(() => {
//         alert("댓글이 등록되었습니다! 🐼");
//         // 입력창 비우기
//         setCommentContent("");
//         setCommentAuthor("");
//         setCommentPw("");
//         fetchComments(selectedBoard.id); // 댓글 목록 갱신
//       })
//       .catch((err) => alert("댓글 등록 실패: " + err.response?.data));
//   };

//   const handleCommentDelete = (c) => {
//     // 1. 회원이 쓴 댓글인 경우
//     if (c.user) {
//       if (!user || user.id !== c.user.id) {
//         alert("본인의 댓글만 삭제할 수 있습니다! 🦾");
//         return;
//       }
//       if (!window.confirm("정말 삭제할까요?")) return;

//       api
//         .delete(`/api/comments/${c.id}`)
//         .then(() => fetchComments(selectedBoard.id))
//         .catch((err) => alert("삭제 실패: " + err.response?.data));
//     }

//     // 2. 비회원이 쓴 댓글인 경우
//     else {
//       const pwd = prompt("비회원 댓글 삭제를 위해 비밀번호를 입력해주세요. 🐼");
//       if (!pwd) return;

//       api
//         .post(`/api/comments/${c.id}/delete`, { password: pwd })
//         .then(() => {
//           fetchComments(selectedBoard.id);
//           alert("댓글이 삭제되었습니다.");
//         })
//         .catch((err) => alert("삭제 실패: 비밀번호가 틀렸습니다!"));
//     }
//   };

//   // --- 스타일 (사용자님 코드 유지) ---
//   const cardStyle = {
//     background: "#fff",
//     borderRadius: "12px",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
//     padding: "25px",
//     marginBottom: "30px",
//   };
//   const inputStyle = {
//     padding: "12px",
//     borderRadius: "8px",
//     border: "1px solid #ddd",
//     marginBottom: "10px",
//     width: "100%",
//     boxSizing: "border-box",
//     fontSize: "14px",
//   };
//   const btnPrimary = {
//     background: "#1a73e8",
//     color: "#fff",
//     border: "none",
//     padding: "12px 20px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "600",
//   };
//   const paginationBtnStyle = {
//     padding: "5px 10px",
//     cursor: "pointer",
//     borderRadius: "4px",
//     fontSize: "14px",
//     border: "1px solid #ddd",
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#f4f7f9",
//         minHeight: "100vh",
//         padding: "40px 20px",
//         fontFamily: "sans-serif",
//         color: "#333",
//       }}
//     >
//       <div style={{ maxWidth: "850px", margin: "0 auto" }}>
//         <header
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "40px",
//           }}
//         >
//           <h1 style={{ color: "#1a73e8", margin: 0 }}>Full-Stack Board 🐼</h1>
//           {user && (
//             <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//               <span>
//                 <strong>{user.nickname}</strong>님
//               </span>
//               <button
//                 onClick={handleLogout}
//                 style={{ padding: "6px 12px", cursor: "pointer" }}
//               >
//                 로그아웃
//               </button>
//             </div>
//           )}
//         </header>

//         {/* 로그인/회원가입 섹션 */}
//         {!user && (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "20px",
//               marginBottom: "40px",
//             }}
//           >
//             <div style={cardStyle}>
//               <h3>로그인</h3>
//               <form onSubmit={handleLogin}>
//                 <input
//                   placeholder="아이디"
//                   style={inputStyle}
//                   value={loginId}
//                   onChange={(e) => setLoginId(e.target.value)}
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="비밀번호"
//                   style={inputStyle}
//                   value={loginPw}
//                   onChange={(e) => setLoginPw(e.target.value)}
//                   required
//                 />
//                 <button style={{ ...btnPrimary, width: "100%" }}>로그인</button>
//               </form>
//             </div>
//             <div style={cardStyle}>
//               <h3>회원가입</h3>
//               <form onSubmit={handleJoin}>
//                 <input
//                   placeholder="아이디"
//                   style={inputStyle}
//                   value={joinId}
//                   onChange={(e) => setJoinId(e.target.value)}
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="비밀번호"
//                   style={inputStyle}
//                   value={joinPw}
//                   onChange={(e) => setJoinPw(e.target.value)}
//                   required
//                 />
//                 <input
//                   placeholder="이름"
//                   style={inputStyle}
//                   value={joinName}
//                   onChange={(e) => setJoinName(e.target.value)}
//                   required
//                 />
//                 <button
//                   style={{
//                     ...btnPrimary,
//                     width: "100%",
//                     background: "#34a853",
//                   }}
//                 >
//                   가입하기
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* 글쓰기 섹션 */}
//         <div style={cardStyle}>
//           <h3>📝 새 포스트</h3>
//           <form onSubmit={handleBoardSubmit}>
//             {!user && (
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <input
//                   placeholder="작성자"
//                   style={inputStyle}
//                   value={nickname}
//                   onChange={(e) => setNickname(e.target.value)}
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="비밀번호"
//                   style={inputStyle}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//             )}
//             <input
//               placeholder="제목"
//               style={inputStyle}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//             <textarea
//               placeholder="내용"
//               style={{ ...inputStyle, height: "120px" }}
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               required
//             />
//             <div style={{ textAlign: "right" }}>
//               <button style={btnPrimary}>게시물 등록</button>
//             </div>
//           </form>
//         </div>

//         {/* 목록 섹션 */}
//         <div style={cardStyle}>
//           <h3>📋 게시글 목록</h3>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr
//                 style={{
//                   borderBottom: "2px solid #eee",
//                   textAlign: "left",
//                   color: "#888",
//                 }}
//               >
//                 <th style={{ padding: "12px" }}>ID</th>
//                 <th style={{ padding: "12px" }}>제목</th>
//                 <th style={{ padding: "12px" }}>작성자</th>
//                 <th style={{ padding: "12px" }}>조회수</th>
//                 <th style={{ padding: "12px" }}>작성일</th>
//               </tr>
//             </thead>
//             <tbody>
//               {boards.map((b) => (
//                 <tr
//                   key={b.id}
//                   onClick={() => handleBoardDetail(b.id)}
//                   style={{
//                     borderBottom: "1px solid #f9f9f9",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <td style={{ padding: "12px" }}>{b.id}</td>
//                   <td
//                     style={{
//                       padding: "12px",
//                       color: "#1a73e8",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {b.title}
//                   </td>
//                   <td style={{ padding: "12px" }}>
//                     {b.user ? b.user.nickname : b.guestNickname || "익명"}
//                   </td>
//                   <td style={{ padding: "12px" }}>{b.viewCount}</td>
//                   <td style={{ padding: "12px", fontSize: "12px" }}>
//                     {dayjs(b.createdAt).fromNow()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 페이지네이션 */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "5px",
//             marginBottom: "40px",
//           }}
//         >
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i)}
//               style={{
//                 ...paginationBtnStyle,
//                 backgroundColor: currentPage === i ? "#1a73e8" : "#fff",
//                 color: currentPage === i ? "#fff" : "#333",
//               }}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>

//         {/* 상세 보기 섹션 */}
//         {selectedBoard && (
//           <div style={{ ...cardStyle, border: "2px solid #1a73e8" }}>
//             {isEditing ? (
//               <div>
//                 <input
//                   style={inputStyle}
//                   value={selectedBoard.title}
//                   onChange={(e) =>
//                     setSelectedBoard({
//                       ...selectedBoard,
//                       title: e.target.value,
//                     })
//                   }
//                 />
//                 <textarea
//                   style={{ ...inputStyle, height: "200px" }}
//                   value={selectedBoard.content}
//                   onChange={(e) =>
//                     setSelectedBoard({
//                       ...selectedBoard,
//                       content: e.target.value,
//                     })
//                   }
//                 />
//                 <button onClick={handleUpdate} style={btnPrimary}>
//                   수정 완료
//                 </button>
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   style={{
//                     ...btnPrimary,
//                     background: "#888",
//                     marginLeft: "10px",
//                   }}
//                 >
//                   취소
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 <h2>{selectedBoard.title}</h2>
//                 <div
//                   style={{
//                     color: "#888",
//                     marginBottom: "20px",
//                     fontSize: "14px",
//                   }}
//                 >
//                   By{" "}
//                   <strong>
//                     {selectedBoard.user
//                       ? selectedBoard.user.nickname
//                       : selectedBoard.guestNickname}
//                   </strong>{" "}
//                   | 조회수 {selectedBoard.viewCount} |{" "}
//                   {dayjs(selectedBoard.createdAt).fromNow()}
//                 </div>
//                 <div
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     marginBottom: "30px",
//                     padding: "15px",
//                     background: "#f9f9f9",
//                     borderRadius: "8px",
//                   }}
//                 >
//                   {selectedBoard.content}
//                 </div>

//                 {/* 본인 글이거나 비회원 글일 때만 수정/삭제 노출 */}
//                 {(!selectedBoard.user ||
//                   (user && user.id === selectedBoard.user.id)) && (
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       style={{
//                         ...btnPrimary,
//                         background: "#eee",
//                         color: "#333",
//                       }}
//                     >
//                       수정
//                     </button>
//                     <button
//                       onClick={() => handleDelete(selectedBoard.id)}
//                       style={{
//                         ...btnPrimary,
//                         background: "#fee2e2",
//                         color: "#ef4444",
//                       }}
//                     >
//                       삭제
//                     </button>
//                   </div>
//                 )}
//                 <button
//                   onClick={() => setSelectedBoard(null)}
//                   style={{
//                     marginTop: "20px",
//                     cursor: "pointer",
//                     background: "none",
//                     border: "none",
//                     textDecoration: "underline",
//                   }}
//                 >
//                   목록으로
//                 </button>

//                 {/* 댓글 영역 */}
//                 <div
//                   style={{
//                     marginTop: "40px",
//                     borderTop: "1px solid #eee",
//                     paddingTop: "20px",
//                   }}
//                 >
//                   <h4>💬 댓글 {comments.length}개</h4>
//                   {comments.map((c) => (
//                     <div
//                       key={c.id}
//                       style={{
//                         padding: "10px",
//                         background: "#f8f9fa",
//                         borderRadius: "8px",
//                         marginBottom: "10px",
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <div>
//                         {/* ⭐ 수정: c.guestNickname을 직접 출력해야 이름이 나옵니다! */}
//                         <strong>
//                           {c.user ? c.user.nickname : c.guestNickname || "익명"}
//                         </strong>
//                         :{" "}
//                         {/* ⭐ 수정: JSON의 필드명이 content가 맞는지 다시 확인 (이미지상 content가 맞음) */}
//                         {c.content}
//                       </div>
//                       {
//                         // 1. 회원 댓글인 경우: 내가 작성자일 때만 노출
//                         ((c.user && user && c.user.id === user.id) ||
//                           // 2. 비회원 댓글인 경우: 항상 노출 (클릭 시 비번 확인)
//                           !c.user) && (
//                           <button
//                             onClick={() => handleCommentDelete(c)}
//                             style={{
//                               border: "none",
//                               color: "red",
//                               cursor: "pointer",
//                               background: "none",
//                             }}
//                           >
//                             ✕
//                           </button>
//                         )
//                       }
//                     </div>
//                   ))}
//                   <form
//                     onSubmit={handleCommentSubmit}
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: "10px",
//                       marginTop: "20px",
//                     }}
//                   >
//                     {/* ⭐ 로그인을 안 했을 때만 이름/비번 칸을 보여줍니다. */}
//                     {!user && (
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: "5px",
//                           width: "100%",
//                           marginBottom: "5px",
//                         }}
//                       >
//                         <input
//                           placeholder="닉네임"
//                           style={{
//                             ...inputStyle,
//                             width: "120px",
//                             marginBottom: 0,
//                           }}
//                           value={commentAuthor} // 상태 연결
//                           onChange={(e) => setCommentAuthor(e.target.value)}
//                           required
//                         />
//                         <input
//                           type="password"
//                           placeholder="비밀번호"
//                           style={{
//                             ...inputStyle,
//                             width: "120px",
//                             marginBottom: 0,
//                           }}
//                           value={commentPw} // 상태 연결
//                           onChange={(e) => setCommentPw(e.target.value)}
//                           required
//                         />
//                       </div>
//                     )}

//                     <input
//                       placeholder="댓글을 입력하세요..."
//                       style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
//                       value={commentContent}
//                       onChange={(e) => setCommentContent(e.target.value)}
//                       required
//                     />
//                     <button style={{ ...btnPrimary, background: "#333" }}>
//                       등록
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import BoardListPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import LoginPage from "./pages/LoginPage";
import WritePage from "./pages/WritePage";
import BoardForm from './pages/BoardForm';
import JoinPage from "./pages/JoinPage";
// 나머지 페이지들도 import 하세요!

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<BoardListPage />} />
            <Route path="/board/:id" element={<BoardDetailPage />} />

            {/* ⭐ 여기 주소(path)들을 각각 다르게 수정해야 합니다! */}
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/write" element={<WritePage />} /> */}
            <Route path="/write" element={<BoardForm isEdit={false} />} />
            <Route path="/edit/:id" element={<BoardForm isEdit={true} />} />
            <Route path="/join" element={<JoinPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
