package com.multicore.crm.service;

import java.time.LocalDateTime;
import java.util.Map;

public interface SupportAnalyticsService {
    Map<String, Object> summary(Long businessId, LocalDateTime start, LocalDateTime end);
}
