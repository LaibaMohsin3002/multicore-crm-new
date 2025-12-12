package com.multicore.crm.service;

import com.multicore.crm.entity.LeadActivity;
import com.multicore.crm.entity.Lead;
import com.multicore.crm.entity.User;
import com.multicore.crm.repository.LeadActivityRepository;
import com.multicore.crm.repository.LeadRepository;
import com.multicore.crm.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class LeadActivityService {

    private final LeadActivityRepository activityRepo;
    private final LeadRepository leadRepo;
    private final UserRepository userRepo;

    public LeadActivityService(LeadActivityRepository activityRepo, LeadRepository leadRepo, UserRepository userRepo) {
        this.activityRepo = activityRepo;
        this.leadRepo = leadRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public LeadActivity createActivity(Long leadId, Long userId, LeadActivity.ActivityType type, String description, int scorePoints) {
        Lead lead = leadRepo.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LeadActivity activity = LeadActivity.builder()
                .lead(lead)
                .createdBy(user)
                .activityType(type)
                .description(description)
                .scorePoints(scorePoints)
                .build();

        return activityRepo.save(activity);
    }

    public List<LeadActivity> getActivitiesByLead(Long leadId) {
        Lead lead = leadRepo.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        return activityRepo.findByLead(lead);
    }

    public List<LeadActivity> getActivitiesByUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return activityRepo.findByCreatedBy(user);
    }
}
