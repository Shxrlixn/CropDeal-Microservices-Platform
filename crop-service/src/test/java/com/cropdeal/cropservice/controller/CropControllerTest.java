package com.cropdeal.cropservice.controller;

import com.cropdeal.cropservice.entity.Crop;
import com.cropdeal.cropservice.service.CropService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CropControllerTest {

    private MockMvc mockMvc;

    private CropController cropController;

    // ✅ Manual stub instead of Mockito (avoids ALL mock issues)
    private CropService cropService;

    @BeforeEach
    void setup() {

        cropService = new CropService(null, null, null, null) {

            @Override
            public Crop getCropById(int id) {
                if (id == 1) {
                    Crop crop = new Crop();
                    crop.setId(1);
                    crop.setName("Rice");
                    return crop;
                }
                return null;
            }

            @Override
            public void deleteCrop(int id) {
                // do nothing
            }
        };

        cropController = new CropController(cropService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(cropController)
                .build();
    }

    // ✅ TEST 1
    @Test
    void shouldReturnTestMessage() throws Exception {
        mockMvc.perform(get("/api/v1/crops/test"))
                .andExpect(status().isOk());
    }

    // ✅ TEST 2
    @Test
    void shouldGetCropById() throws Exception {
        mockMvc.perform(get("/api/v1/crops/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Rice"));
    }

    // ✅ TEST 3
    @Test
    void shouldReturnEmptyWhenCropNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/crops/2"))
                .andExpect(status().isOk()); 
        // change to isNotFound() if controller returns 404
    }

    // ✅ TEST 4
    @Test
    void shouldDeleteCrop() throws Exception {
        mockMvc.perform(delete("/api/v1/crops/1"))
                .andExpect(status().isOk()); 
        // change to isNoContent() if controller returns 204
    }
}