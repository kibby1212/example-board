package com.example.board.domain.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.board.domain.comment.dto.CommentCreateRequestDto;
import com.example.board.domain.comment.dto.CommentResponseDto;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /**
     * 1. 댓글 작성 (DTO 기반)
     */
    @PostMapping("/{boardId}")
    public ResponseEntity<CommentResponseDto> save(
            @PathVariable Long boardId, 
            @RequestBody CommentCreateRequestDto dto, // 👈 Entity 대신 DTO 사용
            Authentication authentication) {
        
        String username = (authentication != null) ? authentication.getName() : null;

        // 서비스에서 이미 DTO를 반환하도록 고쳤으므로 그대로 돌려줍니다.
        CommentResponseDto savedComment = commentService.save(boardId, username, dto);
        
        return ResponseEntity.ok(savedComment);
    }

    /**
     * 2. 특정 게시글의 댓글 목록 조회 (반환: List<CommentResponseDto>)
     */
    @GetMapping("/{boardId}")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long boardId) {
        List<CommentResponseDto> comments = commentService.getCommentsByBoard(boardId);
        return ResponseEntity.ok(comments);
    }

    /**
     * 3. 회원용 댓글 삭제 (토큰 필요)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long id, 
            Authentication authentication) {
        
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
    public ResponseEntity<String> deleteGuestComment(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
        
        String password = body.get("password");
        
        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body("비밀번호를 입력해주세요!");
        }

        commentService.deleteGuestComment(id, password);
        return ResponseEntity.ok("댓글이 삭제되었습니다. 🦾");
    }
    /**
     * 5. 댓글 통합 검색 (Querydsl 사용)
     * GET /api/comments/search?keyword=검색어
     */
    @GetMapping("/search")
    public ResponseEntity<List<CommentResponseDto>> searchComments(@RequestParam String keyword) {
        // 서비스에서 만든 검색 메서드를 호출합니다.
        List<CommentResponseDto> results = commentService.search(keyword);
        return ResponseEntity.ok(results);
    }
    
}