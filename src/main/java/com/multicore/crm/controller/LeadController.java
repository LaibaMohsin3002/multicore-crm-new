package com.multicore.crm.controller;

import com.multicore.crm.dto.CreateLeadDTO;
import com.multicore.crm.dto.LeadDTO;
import com.multicore.crm.dto.UpdateLeadDTO;
import com.multicore.crm.entity.Lead;
import com.multicore.crm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public LeadDTO create(@RequestBody CreateLeadDTO dto) {
        return leadService.createLead(dto);
    }

    @GetMapping("/filter")
    public List<LeadDTO> filterLeads(
            @RequestParam(required = false) Long businessId,
            @RequestParam(required = false) Lead.LeadStatus status,
            @RequestParam(required = false) Integer minScore,
            @RequestParam(required = false) Integer maxScore
    ) {
        return leadService.filterLeads(businessId, status, minScore, maxScore);
    }

    @GetMapping("/{id}")
    public LeadDTO get(@PathVariable Long id) {
        return leadService.getLead(id);
    }

    @GetMapping("/business/{businessId}")
    public List<LeadDTO> getAll(@PathVariable Long businessId) {
        return leadService.getAllLeads(businessId);
    }

    @PutMapping("/{id}")
    public LeadDTO update(@PathVariable Long id, @RequestBody UpdateLeadDTO dto) {
        return leadService.updateLead(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        leadService.deleteLead(id);
    }

    @PatchMapping("/{id}/status")
    public LeadDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        return leadService.updateStatus(id, status);
    }

    @PatchMapping("/{id}/score")
    public LeadDTO updateScore(@PathVariable Long id, @RequestParam Integer score) {
        return leadService.updateScore(id, score);
    }

    @PostMapping("/{id}/convert")
    public LeadDTO convert(@PathVariable Long id) {
        return leadService.convertToCustomer(id);
    }

//    @GetMapping("/filter/status")
//    public List<LeadDTO> filterStatus(@RequestParam String status) {
//        return leadService.filterByStatus(status);
//    }

    @GetMapping("/search")
    public List<LeadDTO> search(@RequestParam String name) {
        return leadService.searchByName(name);
    }
}
