package com.multicore.crm.service;

import com.multicore.crm.dto.CreateLeadDTO;
import com.multicore.crm.dto.LeadDTO;
import com.multicore.crm.dto.UpdateLeadDTO;
import com.multicore.crm.entity.Lead;

import java.util.List;

public interface LeadService {

    LeadDTO createLead(CreateLeadDTO dto);

    LeadDTO getLead(Long id);

    List<LeadDTO> getAllLeads(Long businessId);

    LeadDTO updateLead(Long id, UpdateLeadDTO dto);

    void deleteLead(Long id);

    LeadDTO updateStatus(Long id, String status);

    LeadDTO updateScore(Long id, Integer score);

    LeadDTO convertToCustomer(Long id);

//    List<LeadDTO> filterByStatus(String status);

    List<LeadDTO> searchByName(String name);

    List<LeadDTO> filterLeads(Long businessId, Lead.LeadStatus status, Integer minScore, Integer maxScore);
}
