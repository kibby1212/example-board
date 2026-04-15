package com.example.board.controller;

import com.example.board.entity.Comment;
import com.example.board.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /**
     * 1. 댓글 작성 (회원/비회원 통합)
     */
    @PostMapping("/{boardId}")
    public ResponseEntity<?> save(@PathVariable Long boardId, 
                                  @RequestBody Comment comment, 
                                  Authentication authentication) {
        
        // ⭐ 핵심: 신분증(authentication)이 있으면 이름을 가져오고, 없으면 null을 줍니다.
        // 이 한 줄이 NPE 에러를 해결하는 마법의 지팡이입니다! 🪄
        String username = (authentication != null) ? authentication.getName() : null;

        // 서비스의 save 메서드는 이제 username이 null이면 비회원 로직으로 처리합니다.
        Comment savedComment = commentService.save(boardId, username, comment);
        
        return ResponseEntity.ok(savedComment);
    }

    /**
     * 2. 특정 게시글의 댓글 목록 조회
     */
    @GetMapping("/{boardId}")
    public List<Comment> getComments(@PathVariable Long boardId) {
        return commentService.getCommentsByBoard(boardId);
    }

    /**
     * 3. 회원용 댓글 삭제 (토큰 필요)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다. 🔐");
        }

        commentService.deleteComment(id, authentication.getName());
        return ResponseEntity.ok("댓글이 삭제되었습니다. 🦾");
    }

    /**
     * 4. 비회원용 댓글 삭제 (비밀번호 필요)
     */
    @PostMapping("/{id}/delete")
    public ResponseEntity<?> deleteGuestComment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String password = body.get("password");
        
        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호를 입력해주세요!");
        }

        commentService.deleteGuestComment(id, password);
        return ResponseEntity.ok("댓글이 삭제되었습니다. 🦾");
    }
}