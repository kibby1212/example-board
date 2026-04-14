package com.example.board.controller;

import com.example.board.entity.Board;
import com.example.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 리액트와 통신하기 위한 설정
public class BoardController {

    private final BoardService boardService;

    // 1. 글 쓰기 (POST /api/boards)
    @PostMapping
    public Board write(@RequestBody Board board) {
        return boardService.write(board);
    }

    // 2. 글 목록 조회 (GET /api/boards?page=0)
    // 최신글이 먼저 오도록 정렬 설정 추가
    @GetMapping
    public Page<Board> getList(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return boardService.getList(pageable);
    }

    // 3. 글 상세 조회 (GET /api/boards/1)
    @GetMapping("/{id}")
    public Board getDetail(@PathVariable Long id) {
        return boardService.getDetail(id);
    }

    // 4. 글 삭제 (DELETE /api/boards/1?password=1234)
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id, @RequestParam String password) {
        try {
            boardService.delete(id, password);
            return "삭제 성공!";
        } catch (RuntimeException e) {
            return e.getMessage(); // "비밀번호가 일치하지 않습니다" 등 메시지 반환
        }
    }
    
 // 5. 글 수정 (PUT /api/boards/1)
    @PutMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:5173")
    public Board update(@PathVariable Long id, @RequestBody Board board) {
        return boardService.update(id, board);
    }
}