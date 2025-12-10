package com.multicore.crm.repository;

import com.multicore.crm.entity.Business;
import com.multicore.crm.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {

    List<Ticket> findByBusinessAndCreatedAtBetween(Business business, LocalDateTime start, LocalDateTime end);

    // For scheduler: tickets whose SLA is already due and still open/in progress
    List<Ticket> findBySlaDueAtBeforeAndStatusIn(LocalDateTime time, List<Ticket.Status> statuses);

    // Counts by Business entity (used in support analytics service)
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.business = :business AND t.status = :status")
    long countByStatus(@Param("business") Business business, @Param("status") Ticket.Status status);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.business = :business AND t.priority = :priority")
    long countByPriority(@Param("business") Business business, @Param("priority") Ticket.Priority priority);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.business = :business AND t.isEscalated = true")
    long countEscalated(@Param("business") Business business);

    // Methods by businessId (used in TicketService analytics)
    @Query("SELECT t FROM Ticket t WHERE t.business.id = :businessId")
    List<Ticket> findByBusinessId(@Param("businessId") Long businessId);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.business.id = :businessId AND t.status = :status")
    long countByBusinessIdAndStatus(@Param("businessId") Long businessId, @Param("status") Ticket.Status status);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.business.id = :businessId AND t.priority = :priority")
    long countByBusinessIdAndPriority(@Param("businessId") Long businessId, @Param("priority") Ticket.Priority priority);
}