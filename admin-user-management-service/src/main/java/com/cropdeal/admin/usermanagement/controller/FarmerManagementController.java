package com.cropdeal.admin.usermanagement.controller;

import com.cropdeal.admin.usermanagement.client.FarmerClient;
import com.cropdeal.admin.usermanagement.dto.ApiResponse;
import com.cropdeal.admin.usermanagement.dto.FarmerRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/farmers")
@RequiredArgsConstructor
public class FarmerManagementController {

    private final FarmerClient farmerClient;

    // GET ALL FARMERS
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAllFarmers() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "All farmers fetched",
                        farmerClient.getAllFarmers()
                )
        );
    }

    // GET FARMER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getFarmer(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Farmer fetched",
                        farmerClient.getFarmer(id)
                )
        );
    }

    // UPDATE FARMER PROFILE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> updateFarmer(
            @PathVariable Long id,
            @RequestBody FarmerRequestDto dto
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Farmer updated",
                        farmerClient.updateFarmer(id, dto)
                )
        );
    }

    // VIEW RATINGS
    @GetMapping("/ratings")
    public ResponseEntity<ApiResponse<Object>> getRatings() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Farmer ratings fetched",
                        farmerClient.getAllFarmers()
                )
        );
    }
}