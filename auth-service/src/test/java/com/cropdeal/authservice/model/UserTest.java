package com.cropdeal.authservice.model;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    @Test
    void shouldSetAndGetUserFields() {

        User user = new User();

        user.setId(1);
        user.setEmail("admin@gmail.com");
        user.setPassword("password123");
        user.setRole("ADMIN");

        assertThat(user.getId())
                .isEqualTo(1);

        assertThat(user.getEmail())
                .isEqualTo("admin@gmail.com");

        assertThat(user.getPassword())
                .isEqualTo("password123");

        assertThat(user.getRole())
                .isEqualTo("ADMIN");
    }
}