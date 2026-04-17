package com.example.board.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorResponse {
    private int status;      // HTTP 상태 코드 (예: 400, 404)
    private String message;  // 에러 메시지
    private String code;     // 우리가 정한 에러 코드 (예: "AUTH_001")
}