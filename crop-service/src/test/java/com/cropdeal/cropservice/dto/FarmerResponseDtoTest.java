package com.cropdeal.cropservice.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FarmerResponseDtoTest {

    @Test
    void testDTO() {
        FarmerResponseDto dto = new FarmerResponseDto();
        dto.setId(1L);

        assertEquals(1L, dto.getId());
    }
    @Test
    void testFarmerResponseDtoAllFields() {
        FarmerResponseDto dto = new FarmerResponseDto();
        dto.setId(1L);
        dto.setName("test");
        dto.setEmail("test@mail.com");

        assertEquals(1L, dto.getId());
        assertEquals("test", dto.getName());
        assertEquals("test@mail.com", dto.getEmail());
    }
}