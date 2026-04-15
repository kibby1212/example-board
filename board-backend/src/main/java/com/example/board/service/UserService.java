package com.example.board.service;

import com.example.board.entity.User;
import com.example.board.dto.JoinRequestDto;
import com.example.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 전체적으로 읽기 전용 (성능 최적화)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 1. 회원가입 (Sign Up)
     * AuthController에서 호출합니다.
     */
    @Transactional // 저장 작업이므로 트랜잭션 필요
    public void join(JoinRequestDto dto) {
        // 1. 중복 검사 (이미 있다면 예외 발생)
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("이미 존재하는 아이디입니다. 🐼");
        }

        // 2. DTO -> Entity 변환
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setNickname(dto.getNickname());
        
        // 3. 비밀번호 암호화 (가장 중요!)
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        user.setPassword(encodedPassword);
        
        // 4. 권한 설정 (기본값)
        user.setRole("ROLE_USER");

        // 5. DB 저장
        userRepository.save(user);
    }

    /**
     * 2. 사용자 조회 (아이디로 찾기)
     * 게시글/댓글의 작성자 정보를 채울 때나, 시큐리티에서 유저를 찾을 때 사용합니다.
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }

    /**
     * 3. 아이디 중복 확인
     * 리액트에서 "중복 확인" 버튼을 눌렀을 때 사용합니다.
     */
    public boolean isUsernameDuplicate(String username) {
        return userRepository.existsByUsername(username);
    }
}