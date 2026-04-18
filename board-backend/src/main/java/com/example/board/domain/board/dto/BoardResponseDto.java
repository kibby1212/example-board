package com.example.board.domain.board.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import com.example.board.domain.board.Board;

@Getter
@NoArgsConstructor
public class BoardResponseDto {
    private Long id;
    private String title;
    private String content;
    private String nickname;
    private boolean isMember;
    private int viewCount;
    private LocalDateTime createdAt;
    private int commentCount;
    private String imageUrl; // 🐼 1. 사진 경로를 담을 필드 추가!

    public BoardResponseDto(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.content = board.getContent();
        this.viewCount = board.getViewCount();
        this.createdAt = board.getCreatedAt();
        this.commentCount = board.getComments().size();
        this.imageUrl = board.getImageUrl(); // 🐼 2. 엔티티에서 데이터를 꺼내옵니다.

        // 닉네임 통합 로직
        if (board.getUser() != null) {
            this.nickname = board.getUser().getNickname();
            this.isMember = true;
        } else {
            this.nickname = (board.getGuestNickname() != null) ? board.getGuestNickname() : "익명";
            this.isMember = false;
        }
    }
}