package com.multicore.crm.dto.analytics;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RevenueStatsDTO {
    private Long businessId;
    private double totalPipelineAmount;
    private double openPipelineAmount;
    private double wonAmount;
    private double lostAmount;
    private double averageDealValue;
    private long openDealsCount;
    private long wonDealsCount;
    private long lostDealsCount;
}

