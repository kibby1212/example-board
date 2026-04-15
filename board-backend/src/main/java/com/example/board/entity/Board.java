package com.example.board.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "boards") // 테이블 이름은 복수형인 'boards'로 고정!
@Getter
@Setter
@NoArgsConstructor
public class Board {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;
	private String content;

	// --- 관계 설정 추가 ---
	@ManyToOne(fetch = FetchType.LAZY) // 여러 글은 한 명의 작성자에게 속함
	@JoinColumn(name = "user_id", nullable = true) // DB 테이블의 user_id라는 외래키 컬럼과 연결,비회원을 위해 true로 설정!
	private User user; // 이제 authorName 대신 이 객체를 사용합니다.

	// 댓글 관계설정
	// mappedBy = "board": Comment 엔티티에 있는 'board' 변수 이름과 맞춰야 합니다.
	// cascade = CascadeType.ALL: 게시글 삭제 시 댓글도 같이 삭제!
	// orphanRemoval = true: 관계가 끊긴 댓글 데이터 자동 정리
	@JsonManagedReference
	@OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
	private java.util.List<Comment> comments = new java.util.ArrayList<>();

	// 기존 authorName과 password는 삭제하거나 주석 처리하세요.
	// (이제 로그인을 통해 본인 확인을 하니까요!)
//     private String authorName;
//     private String password;
	private String guestNickname; // 비회원 닉네임
	private String guestPassword; // 비회원 비밀번호

	private int viewCount = 0;

	@Column(updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}
}