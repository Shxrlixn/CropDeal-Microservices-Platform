package com.cropdeal.cropservice.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CropDtoTest {

    @Test
    void testCropDtoGettersAndSetters() {

        CropDto dto = new CropDto();

        dto.setId(1);
        dto.setName("Wheat");
        dto.setPrice(2500.50);
        dto.setFarmerId(101);
        dto.setQuantity(20);

        assertEquals(1, dto.getId());
        assertEquals("Wheat", dto.getName());
        assertEquals(2500.50, dto.getPrice());
        assertEquals(101, dto.getFarmerId());
        assertEquals(20, dto.getQuantity());
    }
}