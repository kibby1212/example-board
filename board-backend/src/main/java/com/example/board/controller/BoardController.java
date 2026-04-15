package com.example.board.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.board.util.PrincipalDetails; // 본인이 만든 위치

import com.example.board.entity.Board;
import com.example.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BoardController {

    private final BoardService boardService;

    // 1. 글 쓰기 (userId 파라미터 추가)
    @PostMapping
    public Board write(@RequestBody Board board, Authentication authentication) {
        // 1. 신분증이 있는지 확인 (로그인 했는지 확인)
        String username = null;
        if (authentication != null) {
            username = authentication.getName(); // 로그인 한 경우에만 이름을 가져옴
        }
        
        // 2. 서비스에 이름(회원) 혹은 null(비회원)을 넘깁니다.
        return boardService.write(board, username);
    }

    // 2. 글 목록 조회
    @GetMapping
    public Page<Board> getList(Pageable pageable) {
        return boardService.getList(pageable);
    }

    // 3. 글 상세 조회
    @GetMapping("/{id}")
    public Board getDetail(@PathVariable Long id) {
        return boardService.getDetail(id);
    }

    // 4. 글 수정 (userId 파ar미터 추가)
    @PutMapping("/{id}")
    public Board update(
        @PathVariable Long id, 
        @RequestBody Board board, 
        // ⭐ @RequestParam 대신 시큐리티의 인증 객체를 사용합니다.
        @AuthenticationPrincipal PrincipalDetails principalDetails 
    ) {
        // 1. 로그인한 회원이라면 토큰에서 유저 ID를 꺼내고, 비회원이면 null을 줍니다.
        Long userId = (principalDetails != null) ? principalDetails.getUser().getId() : null;

        // 2. 이제 서비스로 넘겨주면, 우리가 짠 '회원/비회원 구분 로직'이 작동합니다!
        return boardService.update(id, board, userId);
    }

    // 5. 글 삭제 (userId 파라미터 추가)
 // 회원용 삭제 (DELETE 메서드)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(
        @PathVariable Long id, 
        @AuthenticationPrincipal PrincipalDetails principalDetails
    ) {
        Long userId = (principalDetails != null) ? principalDetails.getUser().getId() : null;
        boardService.delete(id, null, userId);
        return ResponseEntity.ok("삭제 완료! 🗑️");
    }

    // 비회원용 삭제 (POST 메서드 - 비밀번호 전달용)
    @PostMapping("/{id}/delete")
    public ResponseEntity<?> deleteGuestBoard(
        @PathVariable Long id, 
        @RequestBody Map<String, String> payload // {"password": "..."} 형태
    ) {
        boardService.delete(id, payload.get("password"), null);
        return ResponseEntity.ok("삭제 완료! 🗑️");
    }

    // 6. 검색
    @GetMapping("/search")
    public Page<Board> search(@RequestParam String keyword, Pageable pageable) {
        return boardService.search(keyword, pageable);
    }
}