package com.multicore.crm.service;

import com.multicore.crm.dto.business.BusinessProfileDTO;
import com.multicore.crm.dto.business.BusinessServiceDTO;
import com.multicore.crm.dto.business.CreateBusinessServiceRequest;

import java.util.List;

public interface BusinessProfileService {
    BusinessProfileDTO getProfile(Long businessId);
    List<BusinessServiceDTO> getServices(Long businessId);
    BusinessServiceDTO createService(Long businessId, CreateBusinessServiceRequest request);
}

