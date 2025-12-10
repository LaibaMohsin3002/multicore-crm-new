package com.multicore.crm.dto.business;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BusinessProfileDTO {
    private Long businessId;
    private String name;
    private String description;
    private String address;
    private String industry;
    private boolean active;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

