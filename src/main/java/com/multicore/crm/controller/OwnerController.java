package com.multicore.crm.controller;

import com.multicore.crm.dto.LoginResponse;
import com.multicore.crm.dto.admin.CreateBusinessDTO;
import com.multicore.crm.dto.admin.OwnerResponseDTO;
import com.multicore.crm.dto.business.CreateBusinessRequest;
import com.multicore.crm.dto.business.CreateStaffRequest;
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
     * POST /api/business
     * Business Owner creates or updates their business profile
     */
    @PostMapping("/business")
    public ResponseEntity<?> createOrUpdateBusiness(@Valid @RequestBody CreateBusinessRequest request, HttpServletRequest httpRequest) {
        try {
            Long businessId = (Long) httpRequest.getAttribute("businessId");
            Long userId = (Long) httpRequest.getAttribute("userId");
            
            Business business;
            if (businessId != null) {
                // Update existing business
                business = authService.updateBusiness(businessId, request.getName(), request.getAddress(), request.getPhone(), request.getTimezone());
            } else {
                // Create new business and assign to current owner
                business = authService.createBusinessForOwner(userId, request.getName(), request.getAddress(), request.getPhone(), request.getTimezone());
            }
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(OwnerResponseDTO.builder()
                            .message("Business " + (businessId != null ? "updated" : "created") + " successfully")
                            .businessId(business.getId())
                            .businessName(business.getName())
                            .success(true)
                            .build());
        } catch (Exception e) {
            log.error("Business creation/update failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(OwnerResponseDTO.builder()
                            .message("Business operation failed: " + e.getMessage())
                            .success(false)
                            .build());
        }
    }

    // ==================== CREATE BUSINESS (LEGACY) ====================
    @PostMapping("/create-business")
    public ResponseEntity<?> createBusinessLegacy(@Valid @RequestBody CreateBusinessDTO request) {
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

    // ==================== CREATE STAFF (NEW: Direct creation with JSON) ====================
    /**
     * POST /api/business/{businessId}/staff
     * Owner creates a staff member directly in their business
     */
    @PostMapping("/business/{businessId}/staff")
    public ResponseEntity<LoginResponse> createStaffDirect(
            @PathVariable Long businessId,
            @Valid @RequestBody CreateStaffRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long requesterBusinessId = (Long) httpRequest.getAttribute("businessId");
            if (requesterBusinessId == null || !requesterBusinessId.equals(businessId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(LoginResponse.builder()
                                .message("You can only create staff for your own business")
                                .success(false)
                                .build());
            }

            Long createdById = (Long) httpRequest.getAttribute("userId");
            LoginResponse response = authService.createStaff(
                    businessId, 
                    request.getName(), 
                    request.getEmail(), 
                    request.getPassword(), 
                    request.getPhone(), 
                    request.getRole(), 
                    createdById
            );
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

    // ==================== CREATE STAFF (LEGACY: Form params) ====================
    @PostMapping("/create-staff")
    public ResponseEntity<LoginResponse> createStaffLegacy(
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

            Long createdById = (Long) request.getAttribute("userId");
            LoginResponse response = authService.createStaff(businessId, fullName, email, password, phone, roleType, createdById);
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