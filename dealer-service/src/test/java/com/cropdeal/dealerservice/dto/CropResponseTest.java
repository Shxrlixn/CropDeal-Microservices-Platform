package com.cropdeal.dealerservice.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CropResponseTest {

    @Test
    void testGettersAndSetters() {

        CropResponse crop = new CropResponse();

        crop.setId(1);
        crop.setName("Wheat");
        crop.setPrice(250.0);
        crop.setFarmerId(101);
        crop.setQuantity(500);

        assertEquals(1, crop.getId());
        assertEquals("Wheat", crop.getName());
        assertEquals(250.0, crop.getPrice());
        assertEquals(101, crop.getFarmerId());
        assertEquals(500, crop.getQuantity());
    }
}