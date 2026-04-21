package com.example.board.domain.board.repository;

import com.example.board.domain.board.Board;
import com.example.board.domain.board.QBoard; // 🐼 아까 생성한 Q클래스!
import com.example.board.domain.user.QUser;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class BoardRepositoryImpl implements BoardRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	// 🐼 2. 반환 타입을 List -> Page로, 매개변수에 Pageable 추가!
	public Page<Board> searchBoards(String keyword, Pageable pageable) {
		QBoard board = QBoard.board;

		List<Board> content = queryFactory.selectFrom(board)
				.where(board.title.containsIgnoreCase(keyword).or(board.content.containsIgnoreCase(keyword))
						.or(board.user.nickname.containsIgnoreCase(keyword)).and(board.deleted.isFalse()))
				.offset(pageable.getOffset()).limit(pageable.getPageSize()).orderBy(board.createdAt.desc()).fetch();

		Long total = queryFactory.select(board.count()).from(board)
				.where(board.title.containsIgnoreCase(keyword).or(board.content.containsIgnoreCase(keyword))
						.or(board.user.nickname.containsIgnoreCase(keyword)).and(board.deleted.isFalse()))
				.fetchOne();

		return new PageImpl<>(content, pageable, total != null ? total : 0L);
	}
}