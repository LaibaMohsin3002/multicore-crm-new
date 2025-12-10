package com.multicore.crm.controller;

import com.multicore.crm.dto.business.BusinessOnboardingResult;
import com.multicore.crm.dto.business.MultiBusinessOnboardingRequest;
import com.multicore.crm.dto.business.MultiBusinessOnboardingResponse;
import com.multicore.crm.service.MultiBusinessOnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class OnboardingController {

    private final MultiBusinessOnboardingService onboardingService;

    @PostMapping("/bulk")
    public MultiBusinessOnboardingResponse bulkOnboard(@Valid @RequestBody MultiBusinessOnboardingRequest request) {
        return onboardingService.onboard(request);
    }

    @PostMapping("/single")
    public BusinessOnboardingResult onboardSingle(@Valid @RequestBody MultiBusinessOnboardingRequest.SingleBusinessOnboarding request) {
        return onboardingService.onboardSingle(request);
    }
}

