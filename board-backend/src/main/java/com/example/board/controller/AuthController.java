package com.example.board.controller;

import com.example.board.dto.JoinRequestDto;
import com.example.board.dto.LoginRequestDto;
import com.example.board.dto.LoginResponseDto;
import com.example.board.service.AuthService;
import com.example.board.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    /**
     * 1. 회원가입
     */
    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody JoinRequestDto dto) {
        try {
            userService.join(dto);
            return ResponseEntity.ok("회원가입 성공! 🐼");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 2. 아이디 중복 체크
     */
    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.isUsernameDuplicate(username));
    }

    /**
     * 3. 로그인 (AuthService 호출)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto dto) {
        try {
            LoginResponseDto response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 로그인 실패 시 401 Unauthorized 반환
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}