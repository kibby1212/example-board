package com.example.board.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
public class Comment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

	// --- 비회원용 필드 추가 ---
	private String guestNickname; // 비회원 댓글 작성자
	private String guestPassword; // 비회원 댓글 비밀번호 (삭제용)

	// --- 관계 설정 1: 게시글과의 연결 ---
	@JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "board_id")
	private Board board;

	// --- 관계 설정 2: 작성자(회원)와의 연결 ---
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true) // 회원일 경우에만 연결
    private User user;

	// [참고] 이제 로그인을 통해 본인 확인을 하므로,
	// 댓글마다 비밀번호를 따로 저장할 필요가 없어졌습니다.
}