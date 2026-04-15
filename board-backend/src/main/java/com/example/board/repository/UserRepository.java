package com.example.board.repository;

import com.example.board.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // 1. 로그인 시 사용 (아이디로 유저 객체 전체를 가져옴)
    Optional<User> findByUsername(String username);

    // 2. 아이디 중복 확인 시 사용 (존재 여부만 true/false로 반환)
    // MemberRepository의 findByLoginId 기능을 대체합니다.
    boolean existsByUsername(String username);
}