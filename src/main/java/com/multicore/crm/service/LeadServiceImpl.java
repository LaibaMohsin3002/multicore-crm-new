package com.multicore.crm.service;

import com.multicore.crm.dto.CreateLeadDTO;
import com.multicore.crm.dto.LeadDTO;
import com.multicore.crm.dto.UpdateLeadDTO;
import com.multicore.crm.entity.Customer;
import com.multicore.crm.entity.Lead;
import com.multicore.crm.repository.CustomerRepository;
import com.multicore.crm.repository.LeadRepository;
import com.multicore.crm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;

    @Override
    public LeadDTO createLead(CreateLeadDTO dto) {
        Lead lead = new Lead();
        lead.setBusinessId(dto.getBusinessId());
        lead.setCustomerId(dto.getCustomerId());
        lead.setName(dto.getName());
        lead.setEmail(dto.getEmail());
        lead.setPhone(dto.getPhone());
        leadRepository.save(lead);
        return toDTO(lead);
    }

    @Override
    public LeadDTO getLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        return toDTO(lead);
    }

    @Override
    public List<LeadDTO> getAllLeads(Long businessId) {
        return leadRepository.findByBusinessId(businessId)
                .stream().map(this::toDTO).toList();
    }

    @Override
    public LeadDTO updateLead(Long id, UpdateLeadDTO dto) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        if (dto.getName() != null) lead.setName(dto.getName());
        if (dto.getEmail() != null) lead.setEmail(dto.getEmail());
        if (dto.getPhone() != null) lead.setPhone(dto.getPhone());
        if (dto.getStatus() != null) lead.setStatus(dto.getStatus());
        if (dto.getScore() != null) lead.setScore(dto.getScore());

        leadRepository.save(lead);
        return toDTO(lead);
    }

    @Override
    public void deleteLead(Long id) {
        leadRepository.deleteById(id);
    }

    @Override
    public LeadDTO updateStatus(Long id, String status) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        lead.setStatus(Lead.LeadStatus.valueOf(status.toUpperCase()));
        leadRepository.save(lead);
        return toDTO(lead);
    }

    @Override
    public LeadDTO updateScore(Long id, Integer score) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        lead.setScore(score);
        leadRepository.save(lead);
        return toDTO(lead);
    }

    @Override
    public LeadDTO convertToCustomer(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        Customer customer = new Customer();
        customer.setName(lead.getName());
        customer.setEmail(lead.getEmail());
        customer.setPhone(lead.getPhone());
        customer.setBusinessId(lead.getBusinessId());

        customerRepository.save(customer);

        lead.setStatus(Lead.LeadStatus.WON);
        lead.setCustomerId(customer.getId());
        leadRepository.save(lead);

        return toDTO(lead);
    }

    @Override
    public List<LeadDTO> filterLeads(Long businessId, Lead.LeadStatus status, Integer minScore, Integer maxScore) {
        List<Lead> leads = leadRepository.findAll(); // Or use dynamic queries
        return leads.stream()
                .filter(l -> businessId == null || l.getBusinessId().equals(businessId))
                .filter(l -> status == null || l.getStatus() == status)
                .filter(l -> minScore == null || l.getScore() >= minScore)
                .filter(l -> maxScore == null || l.getScore() <= maxScore)
                .map(this::toDTO)
                .toList();
    }

    @Override
    public List<LeadDTO> searchByName(String name) {
        return leadRepository.findByNameContainingIgnoreCase(name)
                .stream().map(this::toDTO).toList();
    }

    private LeadDTO toDTO(Lead lead) {
        LeadDTO dto = new LeadDTO();
        dto.setId(lead.getId());
        dto.setBusinessId(lead.getBusinessId());
        dto.setCustomerId(lead.getCustomerId());
        dto.setName(lead.getName());
        dto.setEmail(lead.getEmail());
        dto.setPhone(lead.getPhone());
        dto.setStatus(lead.getStatus());
        dto.setScore(lead.getScore());
        return dto;
    }
}
