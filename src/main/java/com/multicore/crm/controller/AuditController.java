package com.multicore.crm.controller;

import com.multicore.crm.entity.AuditLog;
import com.multicore.crm.entity.Business;
import com.multicore.crm.repository.BusinessRepository;
import com.multicore.crm.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditLogService auditLogService;
    private final BusinessRepository businessRepository;

    public AuditController(AuditLogService auditLogService, BusinessRepository businessRepository) {
        this.auditLogService = auditLogService;
        this.businessRepository = businessRepository;
    }

    @GetMapping("/business/{businessId}")
    public ResponseEntity<Page<AuditLog>> getBusinessAudit(
            @PathVariable Long businessId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Business business = businessRepository.findById(businessId).orElse(null);
        if (business == null) return ResponseEntity.notFound().build();
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logs = auditLogService.getBusinessLogs(business, start, end, pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<AuditLog>> search(
            @RequestParam(required = false) Long businessId,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) AuditLog.AuditAction action,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Business business = null;
        if (businessId != null) {
            business = businessRepository.findById(businessId).orElse(null);
        }
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logs = auditLogService.search(business, entityType, action, start, end, pageable);
        return ResponseEntity.ok(logs);
    }
}
