package com.example.board.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "boards") // MySQL에 만든 boards 테이블과 연결됩니다.
@Getter @Setter        // 롬복: Getter, Setter 메서드를 자동으로 만듭니다.
@NoArgsConstructor    // 롬복: 기본 생성자를 자동으로 만듭니다.
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 번호 자동 증가(AI) 설정
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String authorName;

    private String password; // 비회원 수정/삭제용 비밀번호

    private Integer viewCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    // 나중에 회원을 구현할 때 이 부분을 member_id와 연결하게 됩니다.
    private Long memberId; 
}