package com.example.board.domain.comment;

import jakarta.persistence.*;
import lombok.*;

import com.example.board.domain.board.Board;
import com.example.board.domain.user.User;
import com.example.board.global.BaseTimeEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
// 🐼 1. 시간을 자동으로 기록하기 위해 부모를 상속받습니다.
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String guestNickname; 
    private String guestPassword; 

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true) 
    private User user;
    
    // 🐼 이제 이 댓글이 언제 생성되었는지(createdAt), 
    // 언제 수정되었는지(updatedAt) 부모로부터 자동으로 물려받습니다.
}