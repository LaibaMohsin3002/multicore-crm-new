package com.multicore.crm.service;

import com.multicore.crm.dto.admin.CreateOwnerDTO;
import com.multicore.crm.dto.business.BusinessOnboardingResult;
import com.multicore.crm.dto.business.MultiBusinessOnboardingRequest;
import com.multicore.crm.dto.business.MultiBusinessOnboardingResponse;
import com.multicore.crm.entity.Business;
import com.multicore.crm.entity.BusinessServiceEntity;
import com.multicore.crm.repository.BusinessRepository;
import com.multicore.crm.repository.BusinessServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MultiBusinessOnboardingServiceImpl implements MultiBusinessOnboardingService {

    private final AuthService authService;
    private final BusinessRepository businessRepository;
    private final BusinessServiceRepository businessServiceRepository;

    @Override
    public MultiBusinessOnboardingResponse onboard(MultiBusinessOnboardingRequest request) {
        List<BusinessOnboardingResult> results = new ArrayList<>();

        for (MultiBusinessOnboardingRequest.SingleBusinessOnboarding payload : request.getBusinesses()) {
            results.add(onboardSingle(payload));
        }

        int succeeded = (int) results.stream().filter(BusinessOnboardingResult::isSuccess).count();

        return MultiBusinessOnboardingResponse.builder()
                .requested(request.getBusinesses().size())
                .succeeded(succeeded)
                .results(results)
                .build();
    }

    @Override
    public BusinessOnboardingResult onboardSingle(MultiBusinessOnboardingRequest.SingleBusinessOnboarding payload) {
        try {
            Business business = authService.createBusiness(
                    payload.getName(),
                    payload.getDescription(),
                    payload.getIndustry()
            );

            // enrich optional fields
            business.setAddress(payload.getAddress());
            businessRepository.save(business);

            boolean ownerCreated = false;
            if (payload.getOwnerEmail() != null && payload.getOwnerPassword() != null) {
                CreateOwnerDTO ownerDTO = new CreateOwnerDTO();
                ownerDTO.setBusinessId(business.getId());
                ownerDTO.setFullName(payload.getOwnerFullName());
                ownerDTO.setEmail(payload.getOwnerEmail());
                ownerDTO.setPassword(payload.getOwnerPassword());
                ownerDTO.setPhone(payload.getOwnerPhone());
                authService.createOwner(ownerDTO);
                ownerCreated = true;
            }

            int servicesCreated = persistServices(business, payload.getServices());

            return BusinessOnboardingResult.builder()
                    .businessId(business.getId())
                    .businessName(business.getName())
                    .ownerCreated(ownerCreated)
                    .servicesCreated(servicesCreated)
                    .success(true)
                    .message("Onboarded")
                    .build();
        } catch (Exception ex) {
            log.error("Onboarding failed for {}: {}", payload.getName(), ex.getMessage());
            return BusinessOnboardingResult.builder()
                    .businessName(payload.getName())
                    .success(false)
                    .message(ex.getMessage())
                    .build();
        }
    }

    private int persistServices(Business business, List<MultiBusinessOnboardingRequest.ServicePayload> services) {
        if (services == null || services.isEmpty()) {
            return 0;
        }

        List<BusinessServiceEntity> toSave = services.stream()
                .map(svc -> BusinessServiceEntity.builder()
                        .business(business)
                        .name(svc.getName())
                        .description(svc.getDescription())
                        .price(svc.getPrice())
                        .active(svc.getActive() == null || svc.getActive())
                        .build())
                .toList();

        return businessServiceRepository.saveAll(toSave).size();
    }
}

