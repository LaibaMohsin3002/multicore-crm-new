package com.multicore.crm.dto.business;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BusinessOnboardingResult {
    private Long businessId;
    private String businessName;
    private boolean ownerCreated;
    private int servicesCreated;
    private boolean success;
    private String message;
}

