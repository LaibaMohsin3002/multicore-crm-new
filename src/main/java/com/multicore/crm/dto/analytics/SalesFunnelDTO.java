package com.multicore.crm.dto.analytics;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SalesFunnelDTO {
    private Long businessId;
    private long totalDeals;
    private long prospectCount;
    private long negotiationCount;
    private long wonCount;
    private long lostCount;
}

