package com.multicore.crm.controller;

import com.multicore.crm.dto.business.BusinessProfileDTO;
import com.multicore.crm.dto.business.BusinessServiceDTO;
import com.multicore.crm.dto.business.CreateBusinessServiceRequest;
import com.multicore.crm.service.BusinessProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/business/{businessId}")
public class BusinessProfileController {

    private final BusinessProfileService businessProfileService;

    @GetMapping("/profile")
    public BusinessProfileDTO getProfile(@PathVariable Long businessId) {
        return businessProfileService.getProfile(businessId);
    }

    @GetMapping("/services")
    public List<BusinessServiceDTO> listServices(@PathVariable Long businessId) {
        return businessProfileService.getServices(businessId);
    }

    @PostMapping("/services")
    public BusinessServiceDTO createService(@PathVariable Long businessId,
                                            @Valid @RequestBody CreateBusinessServiceRequest request) {
        return businessProfileService.createService(businessId, request);
    }
}

