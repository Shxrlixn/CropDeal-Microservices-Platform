package com.cropdeal.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // 🔥 CRITICAL FIX
                .requestMatchers("/auth/login").permitAll()

                // optional
                .requestMatchers("/auth/register").permitAll()

                // allow everything for now (debug mode)
                .anyRequest().permitAll()
            );

        return http.build();
    }
}