package com.example.board.controller;

import com.example.board.entity.User;
import com.example.board.repository.UserRepository;
import com.example.board.service.UserService;
import com.example.board.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // 중요: 아래 final 필드들을 생성자로 자동 주입해줍니다.
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    // 1. 사용할 부품(의존성)들을 선언합니다. (모두 final이어야 함)
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 회원가입
    @PostMapping("/join")
    public String join(@RequestBody User user) {
        try {
            userService.join(user);
            return "회원가입 성공! 🐼";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
    
    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        // UserService의 existsByUsername을 호출해서 결과를 반환
        return ResponseEntity.ok(userService.isUsernameDuplicate(username));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
    	System.out.println("입력된 아이디: " + loginRequest.getUsername());
        System.out.println("입력된 비번: " + loginRequest.getPassword());
        try {
            // 1. 유저 정보 조회
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // 2. 비밀번호 일치 여부 확인
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new RuntimeException("비밀번호가 일치하지 않습니다.");
            }

            // 3. 토큰 생성
            String token = jwtUtil.generateToken(user.getUsername());

            // 4. 응답 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            // 로그인 실패 시 401 에러와 메시지 전송
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}