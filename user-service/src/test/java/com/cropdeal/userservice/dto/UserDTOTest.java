package com.cropdeal.userservice.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class UserDTOTest {

    @Test
    void testGetterSetterMethods() {

        UserDTO dto = new UserDTO();

        dto.setId(1);
        dto.setName("Sherlien");
        dto.setEmail("sherlien@gmail.com");
        dto.setRole("ADMIN");
        dto.setPassword("123");
        dto.setPhone("9876543210");
        dto.setAddress("Bangalore");

        assertEquals(1, dto.getId());
        assertEquals("Sherlien", dto.getName());
        assertEquals("sherlien@gmail.com", dto.getEmail());
        assertEquals("ADMIN", dto.getRole());
        assertEquals("123", dto.getPassword());
        assertEquals("9876543210", dto.getPhone());
        assertEquals("Bangalore", dto.getAddress());
    }


    @Test
    void testParameterizedConstructor() {

        UserDTO dto = new UserDTO(
                2,
                "Alex",
                "alex@gmail.com",
                "USER",
                "9999999999",
                "Chennai"
        );

        assertEquals(2, dto.getId());
        assertEquals("Alex", dto.getName());
        assertEquals("alex@gmail.com", dto.getEmail());
        assertEquals("USER", dto.getRole());
        assertEquals("9999999999", dto.getPhone());
        assertEquals("Chennai", dto.getAddress());
    }
}