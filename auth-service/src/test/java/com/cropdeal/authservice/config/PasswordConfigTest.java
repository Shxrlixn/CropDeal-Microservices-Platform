package com.cropdeal.authservice.config;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class PasswordConfigTest {

    private PasswordConfig passwordConfig;

    @BeforeEach
    void setUp() {

        passwordConfig = new PasswordConfig();
    }

    @Test
    void testPasswordEncoderBeanNotNull() {

        PasswordEncoder passwordEncoder =
                passwordConfig.passwordEncoder();

        assertNotNull(passwordEncoder);
    }

    @Test
    void testPasswordEncoding() {

        PasswordEncoder passwordEncoder =
                passwordConfig.passwordEncoder();

        String rawPassword = "password123";

        String encodedPassword =
                passwordEncoder.encode(rawPassword);

        assertNotNull(encodedPassword);

        assertNotEquals(
                rawPassword,
                encodedPassword
        );
    }

    @Test
    void testPasswordMatches() {

        PasswordEncoder passwordEncoder =
                passwordConfig.passwordEncoder();

        String rawPassword = "password123";

        String encodedPassword =
                passwordEncoder.encode(rawPassword);

        boolean matches =
                passwordEncoder.matches(
                        rawPassword,
                        encodedPassword
                );

        assertTrue(matches);
    }

    @Test
    void testPasswordDoesNotMatch() {

        PasswordEncoder passwordEncoder =
                passwordConfig.passwordEncoder();

        String encodedPassword =
                passwordEncoder.encode("password123");

        boolean matches =
                passwordEncoder.matches(
                        "wrongPassword",
                        encodedPassword
                );

        assertFalse(matches);
    }
}