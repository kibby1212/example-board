package com.example.board.domain.board;

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

    // 1. 글 쓰기 (RequestDto를 받아서 ResponseDto를 반환)
    @Transactional
    public BoardResponseDto write(BoardCreateRequestDto dto, String username) {
        Board board = new Board();
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());

        if (username != null) {
            // 회원 글쓰기
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            board.setUser(user);
        } else {
            // 비회원 글쓰기
            board.setGuestNickname(dto.getGuestNickname());
            if (dto.getGuestPassword() != null) {
                board.setGuestPassword(passwordEncoder.encode(dto.getGuestPassword()));
            }
        }

        Board savedBoard = boardRepository.save(board);
        return new BoardResponseDto(savedBoard);
    }

    // 2. 글 목록 조회 (Page<Entity>를 Page<Dto>로 변환)
    public Page<BoardResponseDto> getList(Pageable pageable) {
        return boardRepository.findAll(pageable)
                .map(BoardResponseDto::new); // 변환 생성자 활용
    }

    // 3. 글 상세 조회
    @Transactional
    public BoardResponseDto getDetail(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));
        
        board.setViewCount(board.getViewCount() + 1);
        return new BoardResponseDto(board);
    }

    // 4. 글 수정
    @Transactional
    public BoardResponseDto update(Long boardId, BoardUpdateRequestDto dto, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 권한 검증
        if (board.getUser() != null) {
            if (userId == null || !board.getUser().getId().equals(userId)) {
                throw new RuntimeException("수정 권한이 없습니다. 🐼");
            }
        } else {
            // 비회원 비밀번호 대조 (RequestDto에 담긴 평문 비번 사용)
            if (!passwordEncoder.matches(dto.getGuestPassword(), board.getGuestPassword())) {
                throw new RuntimeException("비밀번호가 일치하지 않습니다! 🐼");
            }
        }

        // 데이터 업데이트
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());

        return new BoardResponseDto(board);
    }

    // 5. 글 삭제 (삭제는 반환값이 없어도 무방함)
    @Transactional
    public void delete(Long boardId, String inputPassword, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (board.getUser() != null) {
            if (userId == null || !board.getUser().getId().equals(userId)) {
                throw new RuntimeException("삭제 권한이 없습니다. 🐼");
            }
        } else {
            if (!passwordEncoder.matches(inputPassword, board.getGuestPassword())) {
                throw new RuntimeException("비밀번호가 일치하지 않습니다! 🐼");
            }
        }

        boardRepository.delete(board);
    }

 // 6. Querydsl 검색 기능으로 교체! 🐼🦾
    public Page<BoardResponseDto> search(String keyword, Pageable pageable) {
        // 기존의 JPA 쿼리 메서드 대신 Querydsl 리포지토리 메서드를 호출합니다.
        return boardRepository.searchBoards(keyword, pageable)
                .map(BoardResponseDto::new);
    }
}