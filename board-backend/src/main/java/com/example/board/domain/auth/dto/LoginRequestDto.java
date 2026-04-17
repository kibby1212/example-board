package com.example.board.domain.auth.dto;

import lombok.*;

@Getter @Setter
public class LoginRequestDto {
    private String username;
    private String password;
}