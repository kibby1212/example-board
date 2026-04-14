package com.example.board.controller;

import com.example.board.entity.Member;
import com.example.board.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/join")
    public String join(@RequestBody Member member) {
        try {
            memberService.join(member);
            return "회원가입 성공!";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
    
 // 로그인
    @PostMapping("/login")
    public Member login(@RequestBody Member member) {
        // 실제 서비스라면 비밀번호는 제외하고 보대거나 JWT 토큰을 쓰지만,
        // 지금은 학습 단계이니 성공 시 회원 객체를 그대로 반환할게요.
        return memberService.login(member.getLoginId(), member.getPassword());
    }
}