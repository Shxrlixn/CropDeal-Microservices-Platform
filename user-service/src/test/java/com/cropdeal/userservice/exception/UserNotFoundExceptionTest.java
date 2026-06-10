package com.cropdeal.userservice.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class UserNotFoundExceptionTest {

    @Test
    void testExceptionMessage() {

        String errorMessage = "User not found";

        UserNotFoundException exception =
                new UserNotFoundException(errorMessage);

        assertEquals(errorMessage, exception.getMessage());
    }
}