package com.cropdeal.userservice.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class UserTest {

    @Test
    void testUserGettersAndSetters() {

        User user = new User();

        user.setId(1);
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setRole("USER");
        user.setPassword("password123");
        user.setPhone("9876543210");
        user.setAddress("Bangalore");

        assertEquals(1, user.getId());
        assertEquals("John Doe", user.getName());
        assertEquals("john@example.com", user.getEmail());
        assertEquals("USER", user.getRole());
        assertEquals("password123", user.getPassword());
        assertEquals("9876543210", user.getPhone());
        assertEquals("Bangalore", user.getAddress());
    }
}