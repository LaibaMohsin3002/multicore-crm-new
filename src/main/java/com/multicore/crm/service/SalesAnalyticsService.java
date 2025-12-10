package com.multicore.crm.service;

import com.multicore.crm.dto.analytics.RevenueStatsDTO;
import com.multicore.crm.dto.analytics.SalesFunnelDTO;

public interface SalesAnalyticsService {
    SalesFunnelDTO getSalesFunnel(Long businessId);
    RevenueStatsDTO getRevenueStats(Long businessId);
}

