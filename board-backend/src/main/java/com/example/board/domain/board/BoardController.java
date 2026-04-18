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
import org.springframework.http.MediaType; // 🐼 consumes 설정을 위해 필요
import org.springframework.web.bind.annotation.RequestPart; // 🐼 @RequestPart 어노테이션을 위해 필요
import org.springframework.web.multipart.MultipartFile; // 🐼 이미지 파일을 받기 위해 필요

import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BoardController {

	private final BoardService boardService;

	// 1. 글 쓰기 (BoardCreateRequestDto 사용)
	@PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<BoardResponseDto> write(
			// 🐼 게시글 본문 데이터 (JSON)
			@RequestPart("board") BoardCreateRequestDto dto,
			// 🐼 업로드할 이미지 파일 (파일이 없을 수도 있으니 required = false)
			@RequestPart(value = "image", required = false) MultipartFile image, Authentication authentication) {
		String username = (authentication != null) ? authentication.getName() : null;

		// 서비스로 이미지 파일까지 넘겨줍니다.
		BoardResponseDto response = boardService.write(dto, image, username);
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

	// 4. 글 수정 (BoardUpdateRequestDto + 이미지 처리) 🐼🦾
	@PutMapping(value = "/{id}", consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<BoardResponseDto> update(@PathVariable Long id,
			// 🐼 1. @RequestBody 대신 @RequestPart를 사용해 JSON 조각을 받습니다.
			@RequestPart("board") BoardUpdateRequestDto dto,
			// 🐼 2. 업로드할 새 이미지 파일을 받습니다. (필수 X)
			@RequestPart(value = "image", required = false) MultipartFile image,
			// 🐼 3. 이미지 삭제 여부 플래그를 파라미터로 받습니다.
			@RequestParam(value = "deleteImage", defaultValue = "false") boolean deleteImage,
			@AuthenticationPrincipal PrincipalDetails principalDetails) {
		// 유저 ID 추출 (기존 로직 유지)
		Long userId = (principalDetails != null) ? principalDetails.getUser().getId() : null;

		// 🐼 4. 이제 서비스의 5개 인자를 모두 채워서 호출합니다! 🦾
		BoardResponseDto response = boardService.update(id, dto, image, deleteImage, userId);

		return ResponseEntity.ok(response);
	}

	// 5. 회원용 삭제 (기존 로직 유지)
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteBoard(@PathVariable Long id,
			@AuthenticationPrincipal PrincipalDetails principalDetails) {
		Long userId = (principalDetails != null) ? principalDetails.getUser().getId() : null;
		boardService.delete(id, null, userId);
		return ResponseEntity.ok("삭제 완료! 🗑️");
	}

	// 6. 비회원용 삭제 (기존 로직 유지)
	@PostMapping("/{id}/delete")
	public ResponseEntity<String> deleteGuestBoard(@PathVariable Long id, @RequestBody Map<String, String> payload) {
		boardService.delete(id, payload.get("password"), null);
		return ResponseEntity.ok("삭제 완료! 🗑️");
	}

	/**
	 * 7. 검색 (반환 타입: Page<BoardResponseDto>) GET
	 * /api/boards/search?keyword=판다&page=0&size=10
	 */
	@GetMapping("/search")
	public ResponseEntity<Page<BoardResponseDto>> search(@RequestParam String keyword,
			@PageableDefault(size = 10, sort = "createdAt", direction = Direction.DESC) Pageable pageable) {

		return ResponseEntity.ok(boardService.search(keyword, pageable));
	}
}