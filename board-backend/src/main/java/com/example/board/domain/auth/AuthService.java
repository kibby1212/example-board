package com.example.board.domain.auth;

import com.example.board.domain.auth.dto.LoginRequestDto;
import com.example.board.domain.auth.dto.LoginResponseDto;
import com.example.board.domain.user.User;
import com.example.board.domain.user.UserRepository;
import com.example.board.global.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * 로그인 로직
     */
    public LoginResponseDto login(LoginRequestDto dto) {
        // 1. 아이디로 유저 찾기
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. 🐼"));

        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다! 🐼");
        }

        // 3. JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getUsername());

        // 4. 응답 DTO 반환 (민감 정보 제외)
        return new LoginResponseDto(token, user.getUsername(), user.getNickname());
    }
}