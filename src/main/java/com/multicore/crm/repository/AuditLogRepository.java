package com.multicore.crm.repository;

import com.multicore.crm.entity.AuditLog;
import com.multicore.crm.entity.Business;
import com.multicore.crm.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByBusinessAndCreatedAtBetween(Business business, LocalDateTime start, LocalDateTime end, Pageable pageable);

    Page<AuditLog> findByChangedBy(User changedBy, Pageable pageable);

    @Query("SELECT al FROM AuditLog al WHERE (:business IS NULL OR al.business = :business) AND (:entityType IS NULL OR al.entityType = :entityType) AND (:action IS NULL OR al.action = :action) AND (:start IS NULL OR al.createdAt >= :start) AND (:end IS NULL OR al.createdAt <= :end)")
    Page<AuditLog> search(@Param("business") Business business,
                          @Param("entityType") String entityType,
                          @Param("action") AuditLog.AuditAction action,
                          @Param("start") LocalDateTime start,
                          @Param("end") LocalDateTime end,
                          Pageable pageable);
}
