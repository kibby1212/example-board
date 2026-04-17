package com.example.board.domain.auth.dto;

import lombok.*;


@Getter @Setter
public class JoinRequestDto {
    private String username;
    private String password;
    private String nickname;
}