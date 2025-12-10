package com.multicore.crm.dto.business;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MultiBusinessOnboardingResponse {
    private int requested;
    private int succeeded;
    private List<BusinessOnboardingResult> results;
}

