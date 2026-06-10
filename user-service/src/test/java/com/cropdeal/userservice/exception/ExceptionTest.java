package com.cropdeal.userservice.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class ExceptionTest {

    @Test
    void testRuntimeExceptionMessage() {

        RuntimeException ex =
                new RuntimeException("sample");

        assertNotNull(ex);
        assertEquals("sample", ex.getMessage());
    }


    @Test
    void testUserAlreadyExistsException() {

        UserAlreadyExistsException ex =
                new UserAlreadyExistsException(
                        "User already exists"
                );

        assertEquals(
                "User already exists",
                ex.getMessage()
        );
    }


    @Test
    void testInvalidCredentialsException() {

        InvalidCredentialsException ex =
                new InvalidCredentialsException(
                        "Invalid credentials"
                );

        assertEquals(
                "Invalid credentials",
                ex.getMessage()
        );
    }


    @Test
    void testUserNotFoundException() {

        UserNotFoundException ex =
                new UserNotFoundException(
                        "User not found"
                );

        assertEquals(
                "User not found",
                ex.getMessage()
        );
    }
}