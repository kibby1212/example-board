// BoardRepository.java
package com.example.board.repository;

import com.example.board.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
    // 제목 또는 내용에 키워드가 포함된 글 찾기 (Containing 키워드 사용)
	// BoardRepository.java 에 이 내용이 있는지 확인!
	Page<Board> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
}