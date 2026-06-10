package com.cropdeal.admin.farmer.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class AdminFarmerExceptionTest {

    @Test
    void testFarmerAlreadyExistsExceptionMessage() {

        FarmerAlreadyExistsException exception =
                new FarmerAlreadyExistsException("error");

        assertEquals("error", exception.getMessage());
    }

    @Test
    void testFarmerNotFoundExceptionMessage() {

        FarmerNotFoundException exception =
                new FarmerNotFoundException("not found");

        assertEquals("not found", exception.getMessage());
    }
}