package com.multicore.crm.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import com.multicore.crm.service.CustomUserDetailsService;

import java.io.IOException;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil;
    private CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                if (jwtUtil.validateToken(jwt)) {
                    String email = jwtUtil.extractEmail(jwt);
                    Long businessId = jwtUtil.extractBusinessId(jwt);
                    Long userId = jwtUtil.extractUserId(jwt);

                    try {
                        var userDetails = customUserDetailsService.loadUserByUsername(email);

                        // Verify authorities are loaded (for debugging)
                        if (userDetails.getAuthorities().isEmpty()) {
                            log.warn("User {} has no authorities assigned", email);
                        } else {
                            log.debug("User {} authenticated with authorities: {}", email, userDetails.getAuthorities());
                        }

                        // Add businessId and tenantId to request attributes for tenant enforcement
                        request.setAttribute("businessId", businessId);
                        request.setAttribute("tenantId", businessId);
                        request.setAttribute("userId", userId);

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
                        log.error("User not found: {}", e.getMessage());
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write("{\"error\":\"User not found\"}");
                        return;
                    }
                } else {
                    log.warn("Invalid JWT token");
                    // Don't set 401 here for public endpoints - let Spring Security handle it
                    // Only set 401 if this is a protected endpoint
                    String path = request.getRequestURI();
                    if (!path.startsWith("/api/auth/login") && !path.startsWith("/api/auth/register") && !path.startsWith("/api/health")) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\":\"Invalid or expired token\"}");
                        return;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage(), e);
            // Continue filter chain for public endpoints
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}