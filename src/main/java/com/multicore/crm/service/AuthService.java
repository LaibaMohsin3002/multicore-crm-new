package com.multicore.crm.service;

import com.multicore.crm.dto.LoginRequest;
import com.multicore.crm.dto.LoginResponse;
import com.multicore.crm.dto.RegisterRequest;
import com.multicore.crm.dto.admin.CreateOwnerDTO;
import com.multicore.crm.entity.Business;
import com.multicore.crm.entity.Lead;
import com.multicore.crm.entity.Role;
import com.multicore.crm.entity.User;
import com.multicore.crm.repository.BusinessRepository;
import com.multicore.crm.repository.LeadRepository;
import com.multicore.crm.repository.RoleRepository;
import com.multicore.crm.repository.UserRepository;
import com.multicore.crm.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BusinessRepository businessRepository;
    private final LeadRepository leadRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       BusinessRepository businessRepository, LeadRepository leadRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.businessRepository = businessRepository;
        this.leadRepository = leadRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ==================== ADMIN REGISTRATION ====================
    public LoginResponse registerAdmin(RegisterRequest request) {
        // Check if any admin already exists
        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(u -> u.getRoles().stream()
                        .anyMatch(r -> r.getRoleName() == Role.RoleType.SUPER_ADMIN));
        
        if (adminExists) {
            throw new RuntimeException("System admin already exists. Cannot register multiple admins.");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Role adminRole = roleRepository.findByRoleName(Role.RoleType.SUPER_ADMIN)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .roleName(Role.RoleType.SUPER_ADMIN)
                            .description("System Administrator")
                            .build();
                    return roleRepository.save(newRole);
                });

        User admin = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .business(null)
                .status(User.UserStatus.ACTIVE)
                .roles(new HashSet<>(Arrays.asList(adminRole)))
                .build();

        User savedAdmin = userRepository.save(admin);
        log.info("Admin registered successfully: {}", savedAdmin.getEmail());

        String token = jwtUtil.generateToken(savedAdmin);
        return LoginResponse.builder()
                .token(token)
                .userId(savedAdmin.getId())
                .email(savedAdmin.getEmail())
                .fullName(savedAdmin.getFullName())
                .businessId(null)
                .role("SUPER_ADMIN")
                .message("Admin registered successfully")
                .success(true)
                .build();
    }

    // ==================== CUSTOMER REGISTRATION ====================
    // New flow: Registration creates User + Lead (NOT Customer)
    // Customer is created only when Lead is qualified
    @Transactional
    public LoginResponse registerCustomer(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Role customerRole = roleRepository.findByRoleName(Role.RoleType.CUSTOMER)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .roleName(Role.RoleType.CUSTOMER)
                            .description("CRM Customer")
                            .build();
                    return roleRepository.save(newRole);
                });

        User customer = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .business(null)
                .status(User.UserStatus.ACTIVE)
                .roles(new HashSet<>(Arrays.asList(customerRole)))
                .build();

        User savedCustomer = userRepository.save(customer);
        log.info("Customer registered successfully: {}", savedCustomer.getEmail());

        // Generate token - registration is successful at this point
        String token = jwtUtil.generateToken(savedCustomer);
        
        // Build response
        LoginResponse response = LoginResponse.builder()
                .token(token)
                .userId(savedCustomer.getId())
                .email(savedCustomer.getEmail())
                .fullName(savedCustomer.getFullName())
                .businessId(null)
                .role("CUSTOMER")
                .message("Customer registered successfully")
                .success(true)
                .build();
        
        // Create Lead AFTER transaction commits (NEW FLOW: Lead only, NO Customer)
        // Customer is created when Lead status changes to QUALIFIED
        final User finalUser = savedCustomer;
        final RegisterRequest finalRequest = request;
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    try {
                        createLeadForRegisteredUser(finalUser, finalRequest);
                    } catch (Exception e) {
                        log.warn("Failed to create lead for registered user {}: {}. Registration was successful.", 
                                finalUser.getEmail(), e.getMessage());
                    }
                }
            });
        } else {
            // If no transaction, create lead directly
            try {
                createLeadForRegisteredUser(savedCustomer, request);
            } catch (Exception e) {
                log.warn("Failed to create lead for registered user {}: {}. Registration was successful.", 
                        savedCustomer.getEmail(), e.getMessage());
            }
        }
        
        return response;
    }

    // ==================== LOGIN ====================
    @Transactional(readOnly = true, timeout = 10)
    public LoginResponse login(LoginRequest request) {
        try {
            // Use query that eagerly loads relationships to avoid lazy loading issues
            Optional<User> userOpt = userRepository.findByEmailWithRelations(request.getEmail());
            if (userOpt.isEmpty()) {
                throw new RuntimeException("Invalid email or password");
            }

            User user = userOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            if (user.getStatus() != User.UserStatus.ACTIVE) {
                throw new RuntimeException("User account is inactive or suspended");
            }

            // Access roles safely (EAGER loaded, so no lazy loading issue)
            String primaryRole = "CUSTOMER";
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                primaryRole = user.getRoles().iterator().next().getRoleName().toString();
            }

            // Access business (eagerly loaded via query, so no lazy loading issue)
            Long businessId = null;
            Business business = user.getBusiness();
            if (business != null) {
                businessId = business.getId();
            }

            String token = jwtUtil.generateToken(user);
            log.info("User logged in successfully: {} with role: {}", user.getEmail(), primaryRole);

            return LoginResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .businessId(businessId)
                    .role(primaryRole)
                    .message("Login successful")
                    .success(true)
                    .build();
        } catch (RuntimeException e) {
            // Re-throw business exceptions
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during login: {}", e.getMessage(), e);
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    // ==================== CREATE BUSINESS ====================
    public Business createBusiness(String name, String description, String industry) {
        Business business = Business.builder()
                .name(name)
                .description(description)
                .industry(industry)
                .build();

        Business savedBusiness = businessRepository.save(business);
        log.info("Business created successfully: {}", savedBusiness.getName());
        return savedBusiness;
    }

    // ==================== CREATE BUSINESS FOR OWNER ====================
    public Business createBusinessForOwner(Long ownerId, String name, String address, String phone, String timezone) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Business business = Business.builder()
                .name(name)
                .address(address)
                .active(true)
                .owner(owner)
                .build();

        Business savedBusiness = businessRepository.save(business);
        
        // Update owner's business reference
        owner.setBusiness(savedBusiness);
        userRepository.save(owner);
        
        log.info("Business created for owner {}: {}", owner.getEmail(), savedBusiness.getName());
        return savedBusiness;
    }

    // ==================== UPDATE BUSINESS ====================
    public Business updateBusiness(Long businessId, String name, String address, String phone, String timezone) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        if (name != null && !name.trim().isEmpty()) business.setName(name);
        if (address != null) business.setAddress(address);
        // Note: phone and timezone fields would need to be added to Business entity if required

        Business savedBusiness = businessRepository.save(business);
        log.info("Business updated: {}", savedBusiness.getName());
        return savedBusiness;
    }

    // ==================== CREATE OWNER (NEW: Direct creation by Super Admin) ====================
    public LoginResponse createOwnerDirect(String name, String email, String password, String businessName, Long createdById) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Business business = null;
        // If businessName provided, create business; otherwise owner will create it later
        if (businessName != null && !businessName.trim().isEmpty()) {
            business = Business.builder()
                    .name(businessName)
                    .active(true)
                    .build();
            business = businessRepository.save(business);
            log.info("Business created for owner: {}", businessName);
        }

        Role ownerRole = roleRepository.findByRoleName(Role.RoleType.BUSINESS_ADMIN)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .roleName(Role.RoleType.BUSINESS_ADMIN)
                            .description("Business Owner")
                            .build();
                    return roleRepository.save(newRole);
                });

        User createdBy = null;
        if (createdById != null) {
            createdBy = userRepository.findById(createdById).orElse(null);
        }

        User owner = User.builder()
                .fullName(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .business(business)
                .status(User.UserStatus.ACTIVE)
                .roles(new HashSet<>(Arrays.asList(ownerRole)))
                .createdBy(createdBy)
                .requirePasswordReset(false) // Set to true if password was auto-generated
                .build();

        User savedOwner = userRepository.save(owner);
        
        if (business != null) {
            business.setOwner(savedOwner);
            businessRepository.save(business);
        }
        
        log.info("Owner created successfully: {} by user: {}", savedOwner.getEmail(), createdById);

        // Don't return token - owner should login themselves
        return LoginResponse.builder()
                .userId(savedOwner.getId())
                .email(savedOwner.getEmail())
                .fullName(savedOwner.getFullName())
                .businessId(business != null ? business.getId() : null)
                .role("BUSINESS_ADMIN")
                .message("Owner created successfully. Please login to set up your business.")
                .success(true)
                .build();
    }

    // ==================== CREATE OWNER (LEGACY: For existing business) ====================
    public LoginResponse createOwner(CreateOwnerDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Business business = businessRepository.findById(request.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));

        Role ownerRole = roleRepository.findByRoleName(Role.RoleType.BUSINESS_ADMIN)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .roleName(Role.RoleType.BUSINESS_ADMIN)
                            .description("Business Owner")
                            .build();
                    return roleRepository.save(newRole);
                });

        User owner = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .business(business)
                .status(User.UserStatus.ACTIVE)
                .roles(new HashSet<>(Arrays.asList(ownerRole)))
                .requirePasswordReset(false)
                .build();

        User savedOwner = userRepository.save(owner);
        business.setOwner(savedOwner);
        businessRepository.save(business);
        log.info("Owner created successfully: {}", savedOwner.getEmail());

        String token = jwtUtil.generateToken(savedOwner);
        return LoginResponse.builder()
                .token(token)
                .userId(savedOwner.getId())
                .email(savedOwner.getEmail())
                .fullName(savedOwner.getFullName())
                .businessId(savedOwner.getBusiness().getId())
                .role("BUSINESS_ADMIN")
                .message("Owner created successfully")
                .success(true)
                .build();
    }

    // ==================== CREATE STAFF ====================
    public LoginResponse createStaff(Long businessId, String fullName, String email, String password, String phone, Role.RoleType roleType, Long createdById) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        // Only allow non-admin/internal staff roles
        if (roleType == null || roleType == Role.RoleType.SUPER_ADMIN || roleType == Role.RoleType.BUSINESS_ADMIN) {
            throw new RuntimeException("Invalid staff role");
        }

        Role staffRole = roleRepository.findByRoleName(roleType)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .roleName(roleType)
                            .description("Staff Member")
                            .build();
                    return roleRepository.save(newRole);
                });

        User createdBy = null;
        if (createdById != null) {
            createdBy = userRepository.findById(createdById).orElse(null);
        }

        User staff = User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .phone(phone)
                .business(business)
                .status(User.UserStatus.ACTIVE)
                .roles(new HashSet<>(Arrays.asList(staffRole)))
                .createdBy(createdBy)
                .requirePasswordReset(false) // Set to true if password was auto-generated
                .build();

        User savedStaff = userRepository.save(staff);
        log.info("Staff created successfully: {} by user: {}", savedStaff.getEmail(), createdById);
        log.info("Staff created successfully: {}", savedStaff.getEmail());

        String token = jwtUtil.generateToken(savedStaff);
        return LoginResponse.builder()
                .token(token)
                .userId(savedStaff.getId())
                .email(savedStaff.getEmail())
                .fullName(savedStaff.getFullName())
                .businessId(savedStaff.getBusiness().getId())
                .role(roleType.name())
                .message("Staff created successfully")
                .success(true)
                .build();
    }

    // NEW FLOW: Create Lead only (NO Customer) when user registers
    // Customer is created later when Lead status changes to QUALIFIED via convertToCustomer
    // This method runs AFTER transaction commits, so it won't cause rollback
    private void createLeadForRegisteredUser(User savedUser, RegisterRequest request) {
        try {
            List<Business> activeBusinesses = businessRepository.findByActiveTrue();
            if (activeBusinesses.isEmpty()) {
                log.info("No active businesses found. User registered but no lead created.");
                return;
            }

            String phoneValue = (request.getPhone() != null && !request.getPhone().isEmpty()) 
                ? request.getPhone() : "N/A";
            
            // Create Lead for first active business (NEW FLOW: Lead only, NO Customer)
            Business firstBusiness = activeBusinesses.get(0);
            Lead lead = Lead.builder()
                    .name(request.getFullName())
                    .email(request.getEmail())
                    .phone(phoneValue)
                    .business(firstBusiness)
                    .customer(null) // NO Customer - Customer created when Lead is qualified
                    .status(Lead.LeadStatus.NEW)
                    .score(0)
                    .notes("Auto-created lead from customer registration")
                    .build();
            leadRepository.save(lead);
            log.info("Created lead for registered user {} in business {}", savedUser.getEmail(), firstBusiness.getName());
        } catch (Exception e) {
            log.warn("Error creating lead for registered user: {}. Registration was successful.", e.getMessage());
            // Don't throw - registration is already complete
        }
    }

}