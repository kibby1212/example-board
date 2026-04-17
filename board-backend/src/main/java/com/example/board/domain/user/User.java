package com.example.board.domain.user;

import com.example.board.global.BaseTimeEntity;

import jakarta.persistence.*;
import lombok.*;

//나중에 softdelete 추가

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 🐼 1. BaseTimeEntity를 상속받아 가입일과 수정일을 자동으로 관리합니다.
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username; // 로그인 아이디

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호

    private String nickname; // 게시판에 표시될 이름
    
    private String role;     // 권한 (예: ROLE_USER, ROLE_ADMIN)
}