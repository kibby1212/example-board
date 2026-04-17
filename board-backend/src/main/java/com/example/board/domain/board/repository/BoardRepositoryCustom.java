package com.example.board.domain.board.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.board.domain.board.Board;

public interface BoardRepositoryCustom {
    // 🐼 List 대신 Page를 반환하도록 변경
    Page<Board> searchBoards(String keyword, Pageable pageable);
}