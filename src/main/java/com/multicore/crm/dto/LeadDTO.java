package com.multicore.crm.dto;

import com.multicore.crm.entity.Lead.LeadStatus;
import lombok.Data;

@Data
public class LeadDTO {
    private Long id;
    private Long businessId;
    private Long customerId;
    private String name;
    private String email;
    private String phone;
    private LeadStatus status;
    private Integer score;
}
