import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const BoardForm = ({ isEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [guestNickname, setGuestNickname] = useState("");
  const initialPassword = location.state?.guestPassword || "";
  const [guestPassword, setGuestPassword] = useState(initialPassword);

  // 🐼 이미지 관련 상태
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteImage, setDeleteImage] = useState(false); // 기존 이미지 삭제 여부

  const SERVER_URL = "http://localhost:8080";

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/boards/${id}`)
        .then((res) => {
          const { title, content, imageUrl } = res.data;
          setTitle(title);
          setContent(content);
          if (imageUrl) {
            // 🐼 기존 이미지가 있다면 서버 주소를 붙여서 미리보기 세팅
            setImagePreview(`${SERVER_URL}${imageUrl}`);
          }
        })
        .catch(() => {
          alert("데이터를 불러오지 못했습니다. 🐼");
          navigate("/");
        });
    }
  }, [isEdit, id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setDeleteImage(false); // 새 파일을 골랐으므로 삭제 플래그는 false
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setDeleteImage(true); // 🐼 백엔드에 "기존 사진 지워줘!"라고 보낼 신호
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const boardData = { title, content };
    if (!user) {
      boardData.guestPassword = guestPassword;
      if (!isEdit) boardData.guestNickname = guestNickname;
    }

    // 🐼 FormData 구성 (SFF용 대형 운반 상자)
    const formData = new FormData();
    
    // 1. 게시글 JSON 데이터 (Blob 처리 필수)
    formData.append(
      "board",
      new Blob([JSON.stringify(boardData)], { type: "application/json" })
    );

    // 2. 파일 추가
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // 3. 이미지 삭제 여부 (RequestParam으로 받으므로 텍스트로 추가)
    formData.append("deleteImage", deleteImage);

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) {
        // 🦾 백엔드 컨트롤러의 @PutMapping은 이제 FormData를 받습니다.
        await api.put(`/boards/${id}`, formData, config);
        alert("성공적으로 수정되었습니다! 🐼🦾");
        navigate(`/board/${id}`);
      } else {
        await api.post("/boards", formData, config);
        alert("글이 등록되었습니다! ✍️");
        navigate("/");
      }
    } catch (err) {
      const errorMsg = err.response?.data || "전송 실패!";
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
        {/* 비회원 정보 입력 */}
        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {!isEdit && (
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nickname</label>
                <input
                  placeholder="닉네임을 입력하세요"
                  value={guestNickname}
                  onChange={(e) => setGuestNickname(e.target.value)}
                  required
                  className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200 font-medium"
                />
              </div>
            )}
            <div className={`space-y-2 ${isEdit ? "col-span-2" : ""}`}>
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                {isEdit ? "Confirm Password" : "Password"}
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={guestPassword}
                onChange={(e) => setGuestPassword(e.target.value)}
                required
                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder:text-gray-200"
              />
            </div>
          </div>
        )}

        {/* Title Section */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Title</label>
          <input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border-b border-gray-200 py-4 text-3xl font-bold focus:border-black outline-none transition-all placeholder:text-gray-100 tracking-tight"
          />
        </div>

        {/* 🐼 Photo Upload Section (업그레이드됨) */}
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Photo Upload</label>
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 relative group hover:border-black transition-colors">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-black text-white w-6 h-6 text-[10px] font-black flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    X
                  </button>
                </>
              ) : (
                <span className="text-gray-300 group-hover:text-black transition-colors text-xs font-bold">NO IMAGE</span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
              <label 
                htmlFor="image-upload"
                className="inline-block border-2 border-black px-6 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-all"
              >
                {imagePreview ? "Change File" : "Select File"}
              </label>
              <p className="text-[10px] text-gray-400 font-medium">최대 10MB (JPG, PNG)</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Content</label>
          <textarea
            placeholder="어떤 이야기를 들려주실 건가요?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full min-h-[450px] border border-gray-100 p-8 text-lg leading-relaxed focus:border-black outline-none transition-all placeholder:text-gray-200 resize-none font-medium"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center gap-8 pt-6">
          <button type="button" onClick={() => navigate(-1)} className="text-sm font-black text-gray-300 hover:text-black transition-colors uppercase tracking-widest">
            Cancel
          </button>
          <button type="submit" className="bg-black text-white px-14 py-4 text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/5 uppercase tracking-widest">
            {isEdit ? "Save Changes" : "Post it now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardForm;