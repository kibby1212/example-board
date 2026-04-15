package com.example.board.service;

import com.example.board.dto.CommentCreateRequestDto;
import com.example.board.dto.CommentResponseDto;
import com.example.board.entity.Board;
import com.example.board.entity.Comment;
import com.example.board.entity.User;
import com.example.board.repository.BoardRepository;
import com.example.board.repository.CommentRepository;
import com.example.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    /**
     * 1. 댓글 작성 (DTO 기반)
     */
    @Transactional
    public CommentResponseDto save(Long boardId, String username, CommentCreateRequestDto dto) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setBoard(board);

        if (username != null) {
            // 회원 로직
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
            comment.setUser(user);
        } else {
            // 비회원 로직
            comment.setGuestNickname(dto.getGuestNickname());
            if (dto.getGuestPassword() != null) {
                comment.setGuestPassword(passwordEncoder.encode(dto.getGuestPassword()));
            }
        }

        Comment savedComment = commentRepository.save(comment);
        return new CommentResponseDto(savedComment);
    }

    /**
     * 2. 특정 게시글의 댓글 목록 조회 (DTO 리스트 반환)
     */
    public List<CommentResponseDto> getCommentsByBoard(Long boardId) {
        return commentRepository.findByBoardId(boardId).stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * 3-1. 회원용 댓글 삭제 (토큰 기반)
     */
    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (comment.getUser() == null || !comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("본인이 작성한 댓글만 삭제할 수 있습니다.");
        }
        
        commentRepository.delete(comment);
    }

    /**
     * 3-2. 비회원용 댓글 삭제 (비밀번호 기반)
     */
    @Transactional
    public void deleteGuestComment(Long commentId, String inputPassword) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        
        if (comment.getUser() != null) {
            throw new RuntimeException("회원 게시글은 비밀번호로 삭제할 수 없습니다.");
        }

        if (passwordEncoder.matches(inputPassword, comment.getGuestPassword())) {
            commentRepository.delete(comment);
        } else {
            throw new RuntimeException("비밀번호가 일치하지 않습니다! 🐼");
        }
    }

    /**
     * 4. 댓글 수정 (회원 전용 예시)
     */
    @Transactional
    public CommentResponseDto update(Long commentId, String username, String newContent) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (comment.getUser() == null || !comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        comment.setContent(newContent);
        return new CommentResponseDto(comment); // 수정된 결과도 DTO로 반환!
    }
}