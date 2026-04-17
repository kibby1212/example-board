package com.example.board.domain.board;

import com.example.board.domain.board.dto.BoardCreateRequestDto;
import com.example.board.domain.board.dto.BoardResponseDto;
import com.example.board.domain.board.dto.BoardUpdateRequestDto;
import com.example.board.global.security.PrincipalDetails;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BoardController {

    private final BoardService boardService;

    // 1. 글 쓰기 (BoardCreateRequestDto 사용)
    @PostMapping
    public ResponseEntity<BoardResponseDto> write(
        @RequestBody BoardCreateRequestDto dto, 
        Authentication authentication
    ) {
        String username = (authentication != null) ? authentication.getName() : null;
        
        BoardResponseDto response = boardService.write(dto, username);
        return ResponseEntity.ok(response);
    }

    // 2. 글 목록 조회 (반환 타입: Page<BoardResponseDto>)
    @GetMapping
    public ResponseEntity<Page<BoardResponseDto>> getList(Pageable pageable) {
        Page<BoardResponseDto> response = boardService.getList(pageable);
        return ResponseEntity.ok(response);
    }

    // 3. 글 상세 조회 (반환 타입: BoardResponseDto)
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDto> getDetail(@PathVariable Long id) {
        BoardResponseDto response = boardService.getDetail(id);
        return ResponseEntity.ok(response);
    }

    // 4. 글 수정 (BoardUpdateRequestDto 사용)
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDto> update(
        @PathVariable Long id, 
        @RequestBody BoardUpdateRequestDto dto, 
        @AuthenticationPrincipal PrincipalDetails principalDetails 
    ) {
        Long userId = (principalDetails != null) ? principalDetails.getUser().getId() : null;
        
        BoardResponseDto response = boardService.update(id, dto, userId);
        return ResponseEntity.ok(response);
    }

    // 5. 회원용 삭제 (기존 로직 유지)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBoard(
        @PathVariable Long id, 
        @AuthenticationPrincipal PrincipalDetails principalDetails
    ) {
        Long userId = (principalDetails != null) ? principalDetails.getUser().getId() : null;
        boardService.delete(id, null, userId);
        return ResponseEntity.ok("삭제 완료! 🗑️");
    }

    // 6. 비회원용 삭제 (기존 로직 유지)
    @PostMapping("/{id}/delete")
    public ResponseEntity<String> deleteGuestBoard(
        @PathVariable Long id, 
        @RequestBody Map<String, String> payload
    ) {
        boardService.delete(id, payload.get("password"), null);
        return ResponseEntity.ok("삭제 완료! 🗑️");
    }

    /**
     * 7. 검색 (반환 타입: Page<BoardResponseDto>)
     * GET /api/boards/search?keyword=판다&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<BoardResponseDto>> search(
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Direction.DESC) Pageable pageable) {
        
        return ResponseEntity.ok(boardService.search(keyword, pageable));
    }
}