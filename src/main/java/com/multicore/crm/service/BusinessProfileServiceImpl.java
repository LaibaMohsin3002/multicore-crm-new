package com.multicore.crm.service;

import com.multicore.crm.dto.business.BusinessProfileDTO;
import com.multicore.crm.dto.business.BusinessServiceDTO;
import com.multicore.crm.dto.business.CreateBusinessServiceRequest;
import com.multicore.crm.entity.Business;
import com.multicore.crm.entity.BusinessServiceEntity;
import com.multicore.crm.repository.BusinessRepository;
import com.multicore.crm.repository.BusinessServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BusinessProfileServiceImpl implements BusinessProfileService {

    private final BusinessRepository businessRepository;
    private final BusinessServiceRepository businessServiceRepository;

    @Override
    public BusinessProfileDTO getProfile(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        return BusinessProfileDTO.builder()
                .businessId(business.getId())
                .name(business.getName())
                .description(business.getDescription())
                .address(business.getAddress())
                .industry(business.getIndustry())
                .active(business.isActive())
                .ownerName(Optional.ofNullable(business.getOwner()).map(o -> o.getFullName()).orElse(null))
                .ownerEmail(Optional.ofNullable(business.getOwner()).map(o -> o.getEmail()).orElse(null))
                .createdAt(business.getCreatedAt())
                .updatedAt(business.getUpdatedAt())
                .build();
    }

    @Override
    public List<BusinessServiceDTO> getServices(Long businessId) {
        return businessServiceRepository.findByBusinessId(businessId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public BusinessServiceDTO createService(Long businessId, CreateBusinessServiceRequest request) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        BusinessServiceEntity entity = BusinessServiceEntity.builder()
                .business(business)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .active(request.getActive() == null || request.getActive())
                .build();

        BusinessServiceEntity saved = businessServiceRepository.save(entity);
        return toDTO(saved);
    }

    private BusinessServiceDTO toDTO(BusinessServiceEntity entity) {
        return BusinessServiceDTO.builder()
                .id(entity.getId())
                .businessId(entity.getBusiness().getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

