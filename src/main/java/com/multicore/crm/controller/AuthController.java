package com.multicore.crm.controller;

import com.multicore.crm.dto.LoginRequest;
import com.multicore.crm.dto.LoginResponse;
import com.multicore.crm.dto.MeResponse;
import com.multicore.crm.dto.RegisterRequest;
import com.multicore.crm.entity.Role;
import com.multicore.crm.entity.User;
import com.multicore.crm.repository.UserRepository;
import com.multicore.crm.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    // ==================== CUSTOMER REGISTRATION ====================
    /**
     * POST /api/auth/register/customer
     * Public signup for CRM customers
     */
    @PostMapping("/register/customer")
    public ResponseEntity<LoginResponse> registerCustomer(@Valid @RequestBody RegisterRequest request) {
        try {
            LoginResponse response = authService.registerCustomer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Customer registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(LoginResponse.builder()
                            .message("Registration failed: " + e.getMessage())
                            .success(false)
                            .build());
        }
    }

    // ==================== CUSTOMER PORTAL REGISTRATION ====================
    /**
     * POST /api/portal/register
     * Customer self-registration via portal
     */
    @PostMapping("/portal/register")
    public ResponseEntity<LoginResponse> portalRegister(@Valid @RequestBody RegisterRequest request) {
        try {
            // Same as customer registration
            LoginResponse response = authService.registerCustomer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Portal registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(LoginResponse.builder()
                            .message("Registration failed: " + e.getMessage())
                            .success(false)
                            .build());
        }
    }

    // ==================== LOGIN ====================
    /**
     * POST /api/auth/login
     * Single login endpoint for ADMIN, OWNER, STAFF, CUSTOMER
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.builder()
                            .message("Login failed: " + e.getMessage())
                            .success(false)
                            .build());
        }
    }

    // ==================== ME ====================
    /**
     * GET /api/auth/me
     * Returns the current authenticated user's profile derived from JWT
     */
    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(@org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return userRepository.findByEmail(principal.getUsername())
                .map(this::toMeResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    private MeResponse toMeResponse(User u) {
        String roleName = u.getRoles().stream().findFirst().map(Role::getRoleName).map(Enum::name).orElse("VIEWER");
        Long bizId = u.getBusiness() != null ? u.getBusiness().getId() : null;
        return MeResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .role(roleName)
                .businessId(bizId)
                .build();
    }
}