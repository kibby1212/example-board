package com.example.board.domain.board;


import org.springframework.beans.factory.annotation.Value;    // 🐼 @Value 사용을 위해
import org.springframework.web.multipart.MultipartFile;      // 🐼 파일 타입을 위해
import java.io.File;                                         // 🐼 File 클래스
import java.io.IOException;                                  // 🐼 예외 처리
import java.util.UUID;                                       // 🐼 고유 파일명 생성
import com.example.board.domain.board.dto.BoardCreateRequestDto;
import com.example.board.domain.board.dto.BoardResponseDto;
import com.example.board.domain.board.dto.BoardUpdateRequestDto;
import com.example.board.domain.board.repository.BoardRepository;
import com.example.board.domain.user.User;
import com.example.board.domain.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${file.upload-dir}")
    private String uploadDir;

    // ==========================================
    // 1. 게시글 생성 & 상세 조회 (Create & Read)
    // ==========================================

    @Transactional
    public BoardResponseDto write(BoardCreateRequestDto dto, MultipartFile image, String username) {
        Board board = new Board();
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());

        // 회원/비회원 구분
        if (username != null) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            board.setUser(user);
        } else {
            board.setGuestNickname(dto.getGuestNickname());
            if (dto.getGuestPassword() != null) {
                board.setGuestPassword(passwordEncoder.encode(dto.getGuestPassword()));
            }
        }

        // 이미지 저장 (신규)
        if (image != null && !image.isEmpty()) {
            board.setImageUrl("/uploads/" + saveImage(image));
        }

        return new BoardResponseDto(boardRepository.save(board));
    }

    @Transactional
    public BoardResponseDto getDetail(Long id) {
        Board board = findBoardById(id);
        board.setViewCount(board.getViewCount() + 1);
        return new BoardResponseDto(board);
    }

    // ==========================================
    // 2. 게시글 수정 & 삭제 (Update & Delete)
    // ==========================================

    @Transactional
    public BoardResponseDto update(Long boardId, BoardUpdateRequestDto dto, MultipartFile image, boolean deleteImage, Long userId) {
        Board board = findBoardById(boardId);
        
        // 권한 확인
        validateAuthority(board, dto.getGuestPassword(), userId);

        // 이미지 교체 로직
        if (deleteImage || (image != null && !image.isEmpty())) {
            if (board.getImageUrl() != null) {
                deleteActualFile(board.getImageUrl());
                board.setImageUrl(null);
            }
        }
        if (image != null && !image.isEmpty()) {
            board.setImageUrl("/uploads/" + saveImage(image));
        }

        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());
        return new BoardResponseDto(board);
    }

    @Transactional
    public void delete(Long boardId, String inputPassword, Long userId) {
        Board board = findBoardById(boardId);
        validateAuthority(board, inputPassword, userId);

        // 물리 파일 삭제 (게시글 삭제 시 필수!) 🦾
        if (board.getImageUrl() != null) {
            deleteActualFile(board.getImageUrl());
        }
        boardRepository.delete(board);
    }

    // ==========================================
    // 3. 목록 조회 & 검색 (List & Search)
    // ==========================================

    public Page<BoardResponseDto> getList(Pageable pageable) {
        return boardRepository.findAll(pageable).map(BoardResponseDto::new);
    }

    public Page<BoardResponseDto> search(String keyword, Pageable pageable) {
        return boardRepository.searchBoards(keyword, pageable).map(BoardResponseDto::new);
    }

    // ==========================================
    // 4. 내부 헬퍼 메서드 (Private Helpers)
    // ==========================================

    private Board findBoardById(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
    }

    private void validateAuthority(Board board, String password, Long userId) {
        if (board.getUser() != null) {
            if (userId == null || !board.getUser().getId().equals(userId)) {
                throw new RuntimeException("권한이 없습니다. 🐼");
            }
        } else if (!passwordEncoder.matches(password, board.getGuestPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다! 🐼");
        }
    }

    private String saveImage(MultipartFile image) {
        File folder = new File(uploadDir);
        if (!folder.exists()) folder.mkdirs();

        String savedName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        try {
            image.transferTo(new File(uploadDir + savedName));
            return savedName;
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패 🐼💦", e);
        }
    }

    private void deleteActualFile(String imageUrl) {
        String fileName = imageUrl.replace("/uploads/", "");
        File file = new File(uploadDir + fileName);
        if (file.exists()) file.delete();
    }
}