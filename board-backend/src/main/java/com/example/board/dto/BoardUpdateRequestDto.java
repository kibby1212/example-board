package com.example.board.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BoardUpdateRequestDto {
    private String title;
    private String content;
    
    // 비회원 글 수정 시 본인 확인용으로 사용됩니다.
    private String guestPassword;
}