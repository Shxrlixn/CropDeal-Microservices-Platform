package com.cropdeal.orderservice.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FarmerResponseTest {

    @Test
    void testGetterAndSetter() {

        FarmerResponse response = new FarmerResponse();

        User user = new User();
        user.setFirstName("Ravi");

        response.setData(user);

        assertNotNull(response.getData());
        assertEquals("Ravi", response.getData().getFirstName());
    }
}