package com.example.board.domain.board.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BoardCreateRequestDto {
    private String title;
    private String content;
    
    // 비회원일 때만 채워져서 옵니다.
    private String guestNickname;
    private String guestPassword;
}