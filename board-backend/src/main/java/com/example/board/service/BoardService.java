package com.example.board.service;

import com.example.board.entity.Board;
import com.example.board.entity.User;
import com.example.board.repository.BoardRepository;
import com.example.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본적으로 읽기 전용, 쓰기 작업에만 @Transactional 추가
public class BoardService {

	private final BoardRepository boardRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	// 1. 글 쓰기
	@Transactional
	public Board write(Board board, String username) {
		if (username != null) {
			// 1. 회원 글쓰기
			User user = userRepository.findByUsername(username)
					.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
			board.setUser(user);
			// 회원은 guest 정보가 필요 없으므로 비워둡니다.
			board.setGuestNickname(null);
			board.setGuestPassword(null);
		} else {
			// 2. 비회원 글쓰기
			// 리액트에서 보낸 guestNickname과 guestPassword를 그대로 저장하거나 암호화합니다.
			if (board.getGuestPassword() != null) {
				board.setGuestPassword(passwordEncoder.encode(board.getGuestPassword()));
			}
		}
		return boardRepository.save(board);
	}

	// 2. 글 목록 조회 (페이징)
	public Page<Board> getList(Pageable pageable) {
		return boardRepository.findAll(pageable);
	}

	// 3. 글 상세 조회 (조회수 증가 포함 가능)
	@Transactional
	public Board getDetail(Long id) {
		Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));

		// 상세 조회 시 조회수 증가 로직 (선택 사항)
		board.setViewCount(board.getViewCount() + 1);

		return board;
	}

	// 4. 글 수정
	@Transactional
	public Board update(Long boardId, Board updatedBoard, Long userId) {
		Board board = boardRepository.findById(boardId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

		// 1. 회원 게시글인 경우
		if (board.getUser() != null) {
			// userId가 없거나(로그아웃 상태), 작성자 ID와 다르면 차단
			if (userId == null || !board.getUser().getId().equals(userId)) {
				throw new RuntimeException("수정 권한이 없습니다. 🐼");
			}
		}
		// 2. 비회원(익명) 게시글인 경우
		else {
			// DB에 저장된 암호화된 비번과 사용자가 입력한 비번을 비교
			// updatedBoard.getGuestPassword()에 리액트에서 보낸 비번이 들어있어야 합니다.
			if (!passwordEncoder.matches(updatedBoard.getGuestPassword(), board.getGuestPassword())) {
				throw new RuntimeException("비밀번호가 일치하지 않습니다! 🐼");
			}
		}

		// 3. 검증 통과 후 수정 진행
		board.setTitle(updatedBoard.getTitle());
		board.setContent(updatedBoard.getContent());

		return board; // 변경 감지(Dirty Checking)로 자동 저장
	}

	// 5. 글 삭제
	@Transactional
	public void delete(Long boardId, String inputPassword, Long userId) {
	    Board board = boardRepository.findById(boardId)
	            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

	    // 1. 회원 게시글인 경우
	    if (board.getUser() != null) {
	        if (userId == null || !board.getUser().getId().equals(userId)) {
	            throw new RuntimeException("삭제 권한이 없습니다. 🐼");
	        }
	    } 
	    // 2. 비회원(익명) 게시글인 경우
	    else {
	        if (!passwordEncoder.matches(inputPassword, board.getGuestPassword())) {
	            throw new RuntimeException("비밀번호가 일치하지 않습니다! 🐼");
	        }
	    }

	    // 3. 검증 통과 시 삭제 수행
	    boardRepository.delete(board);
	}

	// 6. 검색 기능 (앞서 만든 기능 유지)
	public Page<Board> search(String keyword, Pageable pageable) {
		return boardRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable);
	}
}