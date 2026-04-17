package com.example.board.domain.comment.repository;

import java.util.List;

import com.example.board.domain.comment.Comment;

public interface CommentRepositoryCustom {
    // 댓글 내용, 작성자(회원/비회원) 이름으로 검색하는 기능
    List<Comment> searchComments(String keyword);
}