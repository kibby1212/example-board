package com.example.board.repository;

import com.example.board.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 특정 게시글 ID에 속한 댓글들만 가져오는 쿼리 메서드
    List<Comment> findByBoardId(Long boardId);
}