package com.example.board.domain.comment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.board.domain.comment.Comment;

@Repository
// 🐼 JpaRepository 기능 + 우리가 만든 Custom 기능을 합체!
public interface CommentRepository extends JpaRepository<Comment, Long>, CommentRepositoryCustom {
	@EntityGraph(attributePaths = {"user"})
    List<Comment> findByBoardId(Long boardId);
}