package com.example.board.service;

import com.example.board.entity.Member;
import com.example.board.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    public Member join(Member member) {
        // 아이디 중복 체크
        memberRepository.findByLoginId(member.getLoginId())
                .ifPresent(m -> {
                    throw new RuntimeException("이미 존재하는 아이디입니다.");
                });
        return memberRepository.save(member);
    }
    
 // 로그인
    public Member login(String loginId, String password) {
        return memberRepository.findByLoginId(loginId)
                .filter(m -> m.getPassword().equals(password)) // 비밀번호 대조
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다."));
    }
}