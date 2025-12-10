package com.multicore.crm.service.impl;

import com.multicore.crm.entity.Business;
import com.multicore.crm.entity.Ticket;
import com.multicore.crm.repository.BusinessRepository;
import com.multicore.crm.repository.TicketRepository;
import com.multicore.crm.service.SupportAnalyticsService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SupportAnalyticsServiceImpl implements SupportAnalyticsService {

    private final TicketRepository ticketRepository;
    private final BusinessRepository businessRepository;

    public SupportAnalyticsServiceImpl(TicketRepository ticketRepository, BusinessRepository businessRepository) {
        this.ticketRepository = ticketRepository;
        this.businessRepository = businessRepository;
    }

    @Override
    public Map<String, Object> summary(Long businessId, LocalDateTime start, LocalDateTime end) {
        Business business = businessRepository.findById(businessId).orElse(null);
        if (business == null) return Map.of("error", "Business not found");

        Map<String, Object> result = new HashMap<>();

        List<Ticket> tickets = ticketRepository.findByBusinessAndCreatedAtBetween(business, start, end);
        result.put("totalTickets", tickets.size());
        result.put("open", ticketRepository.countByStatus(business, Ticket.Status.OPEN));
        result.put("inProgress", ticketRepository.countByStatus(business, Ticket.Status.IN_PROGRESS));
        result.put("resolved", ticketRepository.countByStatus(business, Ticket.Status.RESOLVED));
        result.put("closed", ticketRepository.countByStatus(business, Ticket.Status.CLOSED));

        result.put("lowPriority", ticketRepository.countByPriority(business, Ticket.Priority.LOW));
        result.put("mediumPriority", ticketRepository.countByPriority(business, Ticket.Priority.MEDIUM));
        result.put("highPriority", ticketRepository.countByPriority(business, Ticket.Priority.HIGH));
        result.put("urgentPriority", ticketRepository.countByPriority(business, Ticket.Priority.URGENT));

        result.put("escalated", ticketRepository.countEscalated(business));

        return result;
    }
}
