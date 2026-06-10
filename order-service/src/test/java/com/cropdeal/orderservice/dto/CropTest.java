package com.cropdeal.orderservice.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CropTest {

    @Test
    void testCropGettersAndSetters() {

        Crop crop = new Crop();

        crop.setId(101);
        crop.setName("Wheat");
        crop.setQuantity(500);

        assertEquals(101, crop.getId());
        assertEquals("Wheat", crop.getName());
        assertEquals(500, crop.getQuantity());
    }
}