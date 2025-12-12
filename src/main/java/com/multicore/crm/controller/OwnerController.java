package com.multicore.crm.controller;

import com.multicore.crm.dto.LoginResponse;
import com.multicore.crm.dto.admin.CreateBusinessDTO;
import com.multicore.crm.dto.admin.OwnerResponseDTO;
import com.multicore.crm.entity.Business;
import com.multicore.crm.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('BUSINESS_ADMIN')")
public class OwnerController {

    private final AuthService authService;

    public OwnerController(AuthService authService) {
        this.authService = authService;
    }

    // ==================== CREATE BUSINESS ====================
    /**
     * POST /api/owner/create-business
     * Business Owner creates a new business
     */
    @PostMapping("/create-business")
    public ResponseEntity<?> createBusiness(@Valid @RequestBody CreateBusinessDTO request) {
        try {
            Business business = authService.createBusiness(
                    request.getName(),
                    request.getDescription(),
                    request.getIndustry()
            );
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(OwnerResponseDTO.builder()
                            .message("Business created successfully")
                            .businessId(business.getId())
                            .businessName(business.getName())
                            .success(true)
                            .build());
        } catch (Exception e) {
            log.error("Business creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(OwnerResponseDTO.builder()
                            .message("Business creation failed: " + e.getMessage())
                            .success(false)
                            .build());
        }
    }

    // ==================== CREATE STAFF ====================
    /**
     * POST /api/owner/create-staff
     * Owner creates a staff member in their business
     */
    @PostMapping("/create-staff")
    public ResponseEntity<LoginResponse> createStaff(
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String phone,
            @RequestParam(name = "role") com.multicore.crm.entity.Role.RoleType roleType,
            HttpServletRequest request) {
        try {
            Long businessId = (Long) request.getAttribute("businessId");
            if (businessId == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(LoginResponse.builder()
                                .message("Business ID not found in token")
                                .success(false)
                                .build());
            }

            LoginResponse response = authService.createStaff(businessId, fullName, email, password, phone, roleType);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Staff creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(LoginResponse.builder()
                            .message("Staff creation failed: " + e.getMessage())
                            .success(false)
                            .build());
        }
    }
}