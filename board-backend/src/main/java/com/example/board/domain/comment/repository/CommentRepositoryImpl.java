package com.example.board.domain.comment.repository;

import com.example.board.domain.comment.Comment;
import com.example.board.entity.QComment; // 🐼 아까 생성 확인한 그 파일!
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class CommentRepositoryImpl implements CommentRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Comment> searchComments(String keyword) {
        QComment comment = QComment.comment;

        return queryFactory
                .selectFrom(comment)
                .where(
                    // 1. 댓글 내용에 키워드가 포함되거나
                    comment.content.containsIgnoreCase(keyword)
                    // 2. 비회원 닉네임에 포함되거나
                    .or(comment.guestNickname.containsIgnoreCase(keyword))
                    // 3. 회원(User)의 닉네임에 포함된 경우를 모두 찾습니다.
                    .or(comment.user.nickname.containsIgnoreCase(keyword))
                )
                .orderBy(comment.createdAt.desc()) // 최신 댓글부터 정렬
                .fetch();
    }
}