package com.example.board.dto;

import lombok.*;

@Getter
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private String username;
    private String nickname;
}