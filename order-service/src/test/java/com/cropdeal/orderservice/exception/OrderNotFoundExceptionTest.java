package com.cropdeal.orderservice.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderNotFoundExceptionTest {

    @Test
    void testExceptionMessage() {

        String message = "Order not found";

        OrderNotFoundException exception =
                new OrderNotFoundException(message);

        assertEquals(message, exception.getMessage());
    }
}