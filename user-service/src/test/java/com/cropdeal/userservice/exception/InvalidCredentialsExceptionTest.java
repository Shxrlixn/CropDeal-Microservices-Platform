package com.cropdeal.userservice.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class InvalidCredentialsExceptionTest {

    @Test
    void testExceptionMessage() {

        String errorMessage = "Invalid credentials";

        InvalidCredentialsException exception =
                new InvalidCredentialsException(errorMessage);

        assertEquals(errorMessage, exception.getMessage());
    }
}