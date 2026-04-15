package com.example.board.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") // 'user'는 DB 예약어일 수 있어 'users'로 지정합니다.
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

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