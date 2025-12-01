package com.multicore.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CustomerDto {

    @NotNull
    private Long businessId;

    @NotNull
    private String name;

    @Email
    @NotNull
    private String email;

    @Pattern(regexp = "\\+?[0-9]{7,15}")
    private String phone;

    private String address;
    private String source;
}
