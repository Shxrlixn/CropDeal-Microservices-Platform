package com.cropdeal.authservice.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LoginRequestTest {

    @Test
    void shouldSetAndGetEmailAndPassword() {

        LoginRequest loginRequest =
                new LoginRequest();

        loginRequest.setEmail(
                "test@gmail.com"
        );

        loginRequest.setPassword(
                "password123"
        );

        assertThat(loginRequest.getEmail())
                .isEqualTo("test@gmail.com");

        assertThat(loginRequest.getPassword())
                .isEqualTo("password123");
    }
}