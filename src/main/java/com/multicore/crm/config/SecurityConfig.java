//package com.multicore.crm.config;
//
//import com.multicore.crm.security.JwtAuthenticationFilter;
//import com.multicore.crm.security.JwtUtil;
//import com.multicore.crm.service.CustomUserDetailsService;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity(prePostEnabled = true)
//public class SecurityConfig {
//
//    private final CustomUserDetailsService customUserDetailsService;
//    private final JwtUtil jwtUtil;
//
//    public SecurityConfig(CustomUserDetailsService customUserDetailsService, JwtUtil jwtUtil) {
//        this.customUserDetailsService = customUserDetailsService;
//        this.jwtUtil = jwtUtil;
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//
//    @Bean
//    public JwtAuthenticationFilter jwtAuthenticationFilter() {
//        return new JwtAuthenticationFilter(jwtUtil, customUserDetailsService);
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//
//                // ...existing code...
//                .authorizeHttpRequests(authz -> authz
//                        // Public endpoints
//                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()         // <--- add this
//                        .requestMatchers(HttpMethod.POST, "/api/auth/register/admin").permitAll()
//                        .requestMatchers(HttpMethod.POST, "/api/auth/register/customer").permitAll()
//                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
//                        .requestMatchers("/error").permitAll()                                    // allow error page
//                        // Admin endpoints
//                        .requestMatchers(HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")
//                        // Owner endpoints
//                        .requestMatchers(HttpMethod.POST, "/api/owner/**").hasRole("OWNER")
//                        .requestMatchers(HttpMethod.GET, "/api/owner/**").hasRole("OWNER")
//                        // Staff endpoints
//                        .requestMatchers(HttpMethod.POST, "/api/staff/**").hasAnyRole("OWNER", "STAFF")
//                        .requestMatchers(HttpMethod.GET, "/api/staff/**").hasAnyRole("OWNER", "STAFF")
//                        // Customer endpoints
//                        .requestMatchers(HttpMethod.GET, "/api/customer/**").hasRole("CUSTOMER")
//                        .requestMatchers(HttpMethod.PUT, "/api/customer/**").hasRole("CUSTOMER")
//                        // Health check
//                        .requestMatchers("/actuator/**").permitAll()
//                        .anyRequest().authenticated()
//                )
//// ...existing code...
//
//                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}

package com.multicore.crm.config;

import com.multicore.crm.security.JwtAuthenticationFilter;
import com.multicore.crm.security.JwtUtil;
import com.multicore.crm.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtil jwtUtil;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService, JwtUtil jwtUtil) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, customUserDetailsService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints - NO JWT REQUIRED
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register/customer").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/portal/register").permitAll()
                        // Admin/Owner creation flows
                        .requestMatchers(HttpMethod.POST, "/api/auth/register/admin").permitAll()
                        .requestMatchers("/error", "/actuator/**", "/api/health").permitAll()
                        // Role-based guards
                        .requestMatchers("/api/admin/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/owner/**").hasRole("BUSINESS_ADMIN")
                        .requestMatchers("/api/customers/**").hasAnyRole("BUSINESS_ADMIN","SALES_MANAGER","SALES_AGENT","SUPPORT_MANAGER","SUPPORT_AGENT","FINANCE","VIEWER")
                        .requestMatchers("/api/leads/**").hasAnyRole("BUSINESS_ADMIN","SALES_MANAGER","SALES_AGENT","VIEWER")
                        .requestMatchers("/api/tickets/**").hasAnyRole("BUSINESS_ADMIN","SUPPORT_MANAGER","SUPPORT_AGENT","VIEWER","CUSTOMER")
                        .requestMatchers("/api/business/*/sales/**").hasAnyRole("BUSINESS_ADMIN","SALES_AGENT","SUPPORT_MANAGER","SUPPORT_AGENT")
                        .requestMatchers(HttpMethod.POST, "/api/business").hasRole("BUSINESS_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/business/*/staff").hasRole("BUSINESS_ADMIN")
                        .requestMatchers("/api/business/**").hasRole("BUSINESS_ADMIN")
                        .requestMatchers("/api/business/*/tasks/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/leads/activities").permitAll()
                        .requestMatchers("/api/deals/products/**").authenticated()
                            .requestMatchers("/api/audit/**").hasAnyRole("SUPER_ADMIN","BUSINESS_ADMIN")
                            .requestMatchers("/api/support/analytics/**").hasAnyRole("BUSINESS_ADMIN","SUPPORT_MANAGER","SUPPORT_AGENT")
                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Explicit origins required when allowCredentials is true
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}