package com.cropdeal.cropservice.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testUserGettersAndSetters() {

        User user = new User();

        user.setId(1);
        user.setName("Sherlien");
        user.setEmail("sherlien@test.com");
        user.setRole("ADMIN");
        user.setPassword("secret123");
        user.setPhone("9876543210");
        user.setAddress("Bangalore");

        assertEquals(1, user.getId());
        assertEquals("Sherlien", user.getName());
        assertEquals("sherlien@test.com", user.getEmail());
        assertEquals("ADMIN", user.getRole());
        assertEquals("secret123", user.getPassword());
        assertEquals("9876543210", user.getPhone());
        assertEquals("Bangalore", user.getAddress());
    }
}