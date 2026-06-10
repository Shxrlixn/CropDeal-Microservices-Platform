package com.cropdeal.orderservice.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PaymentMismatchExceptionTest {

    @Test
    void testExceptionMessage() {

        String message = "Incorrect payment amount";

        PaymentMismatchException exception =
                new PaymentMismatchException(message);

        assertEquals(message, exception.getMessage());
    }
}