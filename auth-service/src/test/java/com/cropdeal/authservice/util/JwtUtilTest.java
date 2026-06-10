package com.cropdeal.authservice.util;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    private final String SECRET =
            "mysecretkeymysecretkeymysecretkey12345";

    @BeforeEach
    void setUp() {

        jwtUtil = new JwtUtil();

        ReflectionTestUtils.setField(
                jwtUtil,
                "secret",
                SECRET
        );
    }

    @Test
    void testGenerateToken() {

        String token =
                jwtUtil.generateToken(
                        "test@gmail.com",
                        "FARMER"
                );

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testExtractUsername() {

        String token =
                jwtUtil.generateToken(
                        "test@gmail.com",
                        "FARMER"
                );

        String username =
                jwtUtil.extractUsername(token);

        assertEquals(
                "test@gmail.com",
                username
        );
    }

    @Test
    void testExtractRole() {

        String token =
                jwtUtil.generateToken(
                        "test@gmail.com",
                        "FARMER"
                );

        String role =
                jwtUtil.extractRole(token);

        assertEquals(
                "FARMER",
                role
        );
    }

    @Test
    void testValidateToken_ValidToken() {

        String token =
                jwtUtil.generateToken(
                        "test@gmail.com",
                        "FARMER"
                );

        boolean isValid =
                jwtUtil.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    void testValidateToken_InvalidToken() {

        boolean isValid =
                jwtUtil.validateToken(
                        "invalid.token.value"
                );

        assertFalse(isValid);
    }

    @Test
    void testGenerateDifferentTokens() {

        String token1 =
                jwtUtil.generateToken(
                        "user1@gmail.com",
                        "ADMIN"
                );

        String token2 =
                jwtUtil.generateToken(
                        "user2@gmail.com",
                        "DEALER"
                );

        assertNotEquals(token1, token2);
    }
}