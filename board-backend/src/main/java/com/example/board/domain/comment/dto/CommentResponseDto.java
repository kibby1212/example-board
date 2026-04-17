package com.example.board.domain.comment.dto;

import com.example.board.domain.comment.Comment;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentResponseDto {
    private Long id;
    private String content;
    private String nickname;
    private boolean isMember;
    private Long userId; // 프론트에서 본인 확인용으로 쓰기 좋음

    public CommentResponseDto(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        
        // 회원/비회원 닉네임 통합 처리 🐼
        if (comment.getUser() != null) {
            this.nickname = comment.getUser().getNickname();
            this.userId = comment.getUser().getId();
            this.isMember = true;
        } else {
            this.nickname = (comment.getGuestNickname() != null) ? comment.getGuestNickname() : "익명";
            this.userId = null;
            this.isMember = false;
        }
    }
}