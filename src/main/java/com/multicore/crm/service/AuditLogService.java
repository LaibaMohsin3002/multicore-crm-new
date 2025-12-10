package com.multicore.crm.service;

import com.multicore.crm.entity.AuditLog;
import com.multicore.crm.entity.Business;
import com.multicore.crm.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface AuditLogService {
    AuditLog record(String entityType, Long entityId, AuditLog.AuditAction action, User changedBy, Business business, String oldValue, String newValue, String description);

    Page<AuditLog> getBusinessLogs(Business business, LocalDateTime start, LocalDateTime end, Pageable pageable);

    Page<AuditLog> search(Business business, String entityType, AuditLog.AuditAction action, LocalDateTime start, LocalDateTime end, Pageable pageable);
}
