package com.cropdeal.orderservice.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testUserGettersAndSetters() {

        User user = new User();

        user.setId(1);
        user.setFirstName("Ravi");
        user.setLastName("Kumar");
        user.setEmail("ravi@example.com");
        user.setPhone("9876543210");
        user.setAddress("Bangalore");
        user.setState("Karnataka");
        user.setDistrict("Bangalore Urban");
        user.setAadharNumber("123456789012");
        user.setBankAccountNumber("987654321");
        user.setBankName("SBI");
        user.setIfscCode("SBIN0001234");
        user.setStatus("ACTIVE");
        user.setRating(4.5);
        user.setReview("Good farmer");

        assertEquals(1, user.getId());
        assertEquals("Ravi", user.getFirstName());
        assertEquals("Kumar", user.getLastName());
        assertEquals("ravi@example.com", user.getEmail());
        assertEquals("9876543210", user.getPhone());
        assertEquals("Bangalore", user.getAddress());
        assertEquals("Karnataka", user.getState());
        assertEquals("Bangalore Urban", user.getDistrict());
        assertEquals("123456789012", user.getAadharNumber());
        assertEquals("987654321", user.getBankAccountNumber());
        assertEquals("SBI", user.getBankName());
        assertEquals("SBIN0001234", user.getIfscCode());
        assertEquals("ACTIVE", user.getStatus());
        assertEquals(4.5, user.getRating());
        assertEquals("Good farmer", user.getReview());
    }
}