package com.example.board.service;

import com.example.board.entity.Comment;
import com.example.board.entity.Board;
import com.example.board.repository.CommentRepository;
import com.example.board.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;

    public List<Comment> getCommentsByBoard(Long boardId) {
        return commentRepository.findByBoardId(boardId);
    }

    @Transactional
    public Comment save(Long boardId, Comment comment) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));
        comment.setBoard(board);
        return commentRepository.save(comment);
    }

    @Transactional
    public void delete(Long commentId, String password) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 없습니다."));
        if(!comment.getPassword().equals(password)) {
            throw new RuntimeException("비밀번호 불일치");
        }
        commentRepository.delete(comment);
    }
}