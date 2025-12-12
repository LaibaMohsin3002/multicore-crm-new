package com.multicore.crm.dto.business;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBusinessRequest {
    @NotBlank(message = "Business name is required")
    private String name;

    private String address;
    private String phone;
    private String timezone;
    // Logo upload would be handled separately via file upload endpoint
}


