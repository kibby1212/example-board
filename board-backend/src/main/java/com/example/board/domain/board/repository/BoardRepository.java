package com.example.board.domain.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.board.domain.board.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>, BoardRepositoryCustom {
    // 🐼 이제 JpaRepository 기능과 Querydsl 커스텀 기능을 모두 가집니다!
}