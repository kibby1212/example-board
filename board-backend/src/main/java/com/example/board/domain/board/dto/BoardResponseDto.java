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
    private String nickname;     // 회원 닉네임 혹은 비회원 닉네임 통합
    private boolean isMember;    // 회원글 여부 (프론트에서 수정/삭제 버튼 노출 여부 결정 시 유용)
    private int viewCount;
    private LocalDateTime createdAt;
    private int commentCount;    // 댓글 개수만 따로 추출 (전체 댓글 객체를 던지는 대신)

    public BoardResponseDto(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.content = board.getContent();
        this.viewCount = board.getViewCount();
        this.createdAt = board.getCreatedAt();
        this.commentCount = board.getComments().size();

        // 닉네임 통합 로직: DTO에서 미리 처리해서 리액트를 편하게 해줍니다.
        if (board.getUser() != null) {
            this.nickname = board.getUser().getNickname();
            this.isMember = true;
        } else {
            this.nickname = (board.getGuestNickname() != null) ? board.getGuestNickname() : "익명";
            this.isMember = false;
        }
    }
}