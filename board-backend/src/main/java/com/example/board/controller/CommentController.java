package com.example.board.controller;

import com.example.board.entity.Comment;
import com.example.board.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{boardId}")
    public List<Comment> getComments(@PathVariable Long boardId) {
        return commentService.getCommentsByBoard(boardId);
    }

    @PostMapping("/{boardId}")
    public Comment save(@PathVariable Long boardId, @RequestBody Comment comment) {
        return commentService.save(boardId, comment);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id, @RequestParam String password) {
        try {
            commentService.delete(id, password);
            return "댓글 삭제 성공";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}