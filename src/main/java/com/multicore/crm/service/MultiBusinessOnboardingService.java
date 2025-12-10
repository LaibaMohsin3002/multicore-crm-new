package com.multicore.crm.service;

import com.multicore.crm.dto.business.BusinessOnboardingResult;
import com.multicore.crm.dto.business.MultiBusinessOnboardingRequest;
import com.multicore.crm.dto.business.MultiBusinessOnboardingResponse;

public interface MultiBusinessOnboardingService {
    MultiBusinessOnboardingResponse onboard(MultiBusinessOnboardingRequest request);
    BusinessOnboardingResult onboardSingle(MultiBusinessOnboardingRequest.SingleBusinessOnboarding payload);
}

