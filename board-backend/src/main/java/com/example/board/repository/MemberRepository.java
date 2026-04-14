package com.example.board.repository;

import com.example.board.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // 아이디 중복 확인을 위해 아이디로 찾는 기능 추가
    Optional<Member> findByLoginId(String loginId);
}