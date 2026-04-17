package com.example.board.global.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // 🐼 이 클래스가 설정 부품임을 알립니다.
public class QuerydslConfig {

    @PersistenceContext
    private EntityManager entityManager; // 🐼 JPA가 사용하는 공장장(EntityManager)을 가져옵니다.

    @Bean // 🐼 드디어 JPAQueryFactory를 스프링 빈으로 등록합니다!
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}