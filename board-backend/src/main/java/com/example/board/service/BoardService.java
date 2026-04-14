package com.example.board.service;

import com.example.board.entity.Board;
import com.example.board.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor // 레포지토리를 자동으로 연결(주입)해줍니다.
public class BoardService {

    private final BoardRepository boardRepository;

    // 1. 글 쓰기 (Create)
    @Transactional
    public Board write(Board board) {
        return boardRepository.save(board);
    }

    // 2. 글 목록 보기 (Read + 페이징 처리)
    public Page<Board> getList(Pageable pageable) {
        return boardRepository.findAll(pageable);
    }

    // 3. 글 상세 보기 (Read)
    public Board getDetail(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
    }

    // 4. 글 삭제 (Delete - 비회원 비밀번호 체크 포함)
    @Transactional
    public void delete(Long id, String inputPassword) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));
        
        // 비밀번호가 일치하거나, 회원글(memberId가 있음)인 경우 처리 로직 필요
        if (board.getPassword() != null && !board.getPassword().equals(inputPassword)) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        boardRepository.delete(board);
    }
    
 // 5. 글 수정 (Update)
    @Transactional
    public Board update(Long id, Board boardData) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));
        
        // 비밀번호 확인
        if (board.getPassword() != null && !board.getPassword().equals(boardData.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        board.setTitle(boardData.getTitle());
        board.setContent(boardData.getContent());
        
        return board; // @Transactional이 있어서 자동으로 DB에 반영됩니다.
    }
}