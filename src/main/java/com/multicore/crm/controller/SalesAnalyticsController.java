package com.multicore.crm.controller;

import com.multicore.crm.dto.analytics.RevenueStatsDTO;
import com.multicore.crm.dto.analytics.SalesFunnelDTO;
import com.multicore.crm.service.SalesAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/business/{businessId}/sales")
public class SalesAnalyticsController {

    private final SalesAnalyticsService salesAnalyticsService;

    @GetMapping("/funnel")
    public SalesFunnelDTO getFunnel(@PathVariable Long businessId) {
        return salesAnalyticsService.getSalesFunnel(businessId);
    }

    @GetMapping("/revenue")
    public RevenueStatsDTO getRevenue(@PathVariable Long businessId) {
        return salesAnalyticsService.getRevenueStats(businessId);
    }
}

