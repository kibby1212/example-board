package com.example.board.global;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass // 🐼 테이블로 생성되지 않고, 상속받는 자식에게 매핑 정보만 제공합니다.
@EntityListeners(AuditingEntityListener.class) // 🐼 Auditing 기능을 포함시킵니다.
public abstract class BaseTimeEntity {

    @CreatedDate // 🐼 엔티티가 생성되어 저장될 때 시간이 자동 저장됩니다.
    @Column(updatable = false) // 생성일은 수정되면 안 되겠죠?
    private LocalDateTime createdAt;

    @LastModifiedDate // 🐼 엔티티의 값을 변경할 때 시간이 자동 저장됩니다.
    private LocalDateTime updatedAt;
}