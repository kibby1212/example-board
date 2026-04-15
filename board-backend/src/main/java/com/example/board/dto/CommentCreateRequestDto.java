package com.example.board.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CommentCreateRequestDto {
    private String content;
    private String guestNickname; // 비회원일 때만 사용
    private String guestPassword; // 비회원일 때만 사용
}