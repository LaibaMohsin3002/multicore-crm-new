package com.multicore.crm.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.multicore.crm.entity.AuditLog;
import com.multicore.crm.entity.Business;
import com.multicore.crm.entity.User;
import com.multicore.crm.repository.AuditLogRepository;
import com.multicore.crm.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public AuditLog record(String entityType, Long entityId, AuditLog.AuditAction action, User changedBy, Business business, String oldValue, String newValue, String description) {
        AuditLog log = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .changedBy(changedBy)
                .oldValue(safeString(oldValue))
                .newValue(safeString(newValue))
                .description(description)
                .business(business)
                .build();
        return auditLogRepository.save(log);
    }

    @Override
    public Page<AuditLog> getBusinessLogs(Business business, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return auditLogRepository.findByBusinessAndCreatedAtBetween(business, start, end, pageable);
    }

    @Override
    public Page<AuditLog> search(Business business, String entityType, AuditLog.AuditAction action, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return auditLogRepository.search(business, entityType, action, start, end, pageable);
    }

    private String safeString(String s) {
        if (s == null) return null;
        try {
            // If it's already JSON, keep; otherwise, wrap as string
            objectMapper.readTree(s);
            return s;
        } catch (JsonProcessingException e) {
            return s;
        }
    }
}
