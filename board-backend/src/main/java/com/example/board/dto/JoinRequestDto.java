package com.example.board.dto;

import lombok.*;


@Getter @Setter
public class JoinRequestDto {
    private String username;
    private String password;
    private String nickname;
}