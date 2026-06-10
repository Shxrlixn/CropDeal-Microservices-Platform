package com.cropdeal.userservice.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class UserAlreadyExistsExceptionTest {

    @Test
    void testExceptionMessage() {

        String errorMessage = "User already exists";

        UserAlreadyExistsException exception =
                new UserAlreadyExistsException(errorMessage);

        assertEquals(errorMessage, exception.getMessage());
    }
}