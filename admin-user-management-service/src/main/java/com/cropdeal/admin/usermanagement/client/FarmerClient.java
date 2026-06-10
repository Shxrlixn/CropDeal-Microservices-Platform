package com.cropdeal.admin.usermanagement.client;

import com.cropdeal.admin.usermanagement.dto.FarmerRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "farmer-service")
public interface FarmerClient {

    // 🔹 GET ALL FARMERS
    @GetMapping("/api/v1/admin/farmers")
    Object getAllFarmers();

    // 🔹 GET FARMER BY ID
    @GetMapping("/api/v1/admin/farmers/{id}")
    Object getFarmer(@PathVariable Long id);

    // 🔹 UPDATE FARMER PROFILE
    @PutMapping("/api/v1/admin/farmers/{id}")
    Object updateFarmer(@PathVariable Long id,
                        @RequestBody FarmerRequestDto dto);
}