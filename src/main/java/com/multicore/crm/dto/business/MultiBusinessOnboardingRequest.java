package com.multicore.crm.dto.business;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class MultiBusinessOnboardingRequest {

    @NotEmpty
    @Valid
    private List<SingleBusinessOnboarding> businesses;

    @Data
    public static class SingleBusinessOnboarding {
        @NotBlank
        private String name;

        private String description;
        private String address;
        private String industry;

        @Size(max = 200)
        private String ownerFullName;
        private String ownerEmail;
        private String ownerPassword;
        private String ownerPhone;

        @Valid
        private List<ServicePayload> services;
    }

    @Data
    public static class ServicePayload {
        @NotBlank
        private String name;
        private String description;
        private java.math.BigDecimal price;
        private Boolean active;
    }
}

