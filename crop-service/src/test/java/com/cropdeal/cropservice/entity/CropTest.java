package com.cropdeal.cropservice.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CropTest {

    @Test
    void testCropEntity() {
        Crop crop = new Crop();
        crop.setId(1);
        crop.setName("Rice");
        crop.setPrice(100);
        crop.setFarmerId(2);

        assertEquals(1, crop.getId());
        assertEquals("Rice", crop.getName());
        assertEquals(100, crop.getPrice());
        assertEquals(2, crop.getFarmerId());
    }
    @Test
    void testCropEntityAllFields() {
        Crop c = new Crop();
        c.setId(1);
        c.setName("Rice");
        c.setPrice(100);
        c.setFarmerId(2);

        assertEquals(1, c.getId());
        assertEquals("Rice", c.getName());
        assertEquals(100, c.getPrice());
        assertEquals(2, c.getFarmerId());
    }
}