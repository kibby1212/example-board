package com.example.board.domain.board;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.example.board.domain.comment.Comment;
import com.example.board.domain.user.User;
import com.example.board.global.BaseTimeEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boards")
@Getter
@Setter
@NoArgsConstructor
// 🐼 1. 삭제 시 실제 DELETE 대신 UPDATE 쿼리를 날리도록 설정합니다.
@SQLDelete(sql = "UPDATE boards SET deleted = true WHERE id = ?")
// 🐼 2. 평상시 조회할 때 삭제되지 않은(deleted = false) 데이터만 가져오게 합니다.
@SQLRestriction("deleted = false")
public class Board extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @JsonManagedReference
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    private String guestNickname; 
    private String guestPassword; 

    private int viewCount = 0;

    // 🐼 3. 삭제 여부를 기록할 상태 필드를 추가합니다.
    private boolean deleted = false;
}