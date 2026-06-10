package com.cropdeal.admin.farmer.controller;

import com.cropdeal.admin.farmer.dto.ApiResponse;
import com.cropdeal.admin.farmer.dto.FarmerRequestDto;
import com.cropdeal.admin.farmer.dto.FarmerResponseDto;
import com.cropdeal.admin.farmer.entity.Farmer;
import com.cropdeal.admin.farmer.service.AdminFarmerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/farmers")
@Tag(name = "Admin Farmer Management",
     description = "Admin APIs for managing farmers")
public class AdminFarmerController {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(AdminFarmerController.class);

    private final AdminFarmerService adminFarmerService;

    public AdminFarmerController(AdminFarmerService adminFarmerService) {
        this.adminFarmerService = adminFarmerService;
    }

    // 🔥 ADD FARMER
    @PostMapping
    @Operation(summary = "Add a new farmer")
    public ResponseEntity<ApiResponse<FarmerResponseDto>> addFarmer(
            @Valid @RequestBody FarmerRequestDto requestDto) {

        LOGGER.info("Adding farmer");

        FarmerResponseDto response =
                adminFarmerService.addFarmer(requestDto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Farmer added", response));
    }

    // 🔥 GET FARMER BY ID
    @GetMapping("/{id}")
    @Operation(summary = "Get farmer by ID")
    public ResponseEntity<ApiResponse<FarmerResponseDto>> getFarmerById(
            @PathVariable Long id) {

        LOGGER.info("Fetching farmer with id {}", id);

        FarmerResponseDto response =
                adminFarmerService.getFarmerById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Farmer fetched", response));
    }

    // 🔥 GET ALL FARMERS
    @GetMapping
    @Operation(summary = "Get all farmers")
    public ResponseEntity<ApiResponse<List<FarmerResponseDto>>> getAllFarmers() {

        LOGGER.info("Fetching all farmers");

        return ResponseEntity.ok(
                ApiResponse.success(
                        "All farmers fetched",
                        adminFarmerService.getAllFarmers()
                )
        );
    }

    // 🔥 GET ACTIVE FARMERS
    @GetMapping("/active")
    @Operation(summary = "Get all active farmers")
    public ResponseEntity<ApiResponse<List<FarmerResponseDto>>> getActiveFarmers() {

        LOGGER.info("Fetching active farmers");

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Active farmers fetched",
                        adminFarmerService.getActiveFarmers()
                )
        );
    }

    // 🔥 GET INACTIVE FARMERS
    @GetMapping("/inactive")
    @Operation(summary = "Get all inactive farmers")
    public ResponseEntity<ApiResponse<List<FarmerResponseDto>>> getInactiveFarmers() {

        LOGGER.info("Fetching inactive farmers");

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inactive farmers fetched",
                        adminFarmerService.getInactiveFarmers()
                )
        );
    }

    // 🔥 GET FARMERS BY STATUS
    @GetMapping("/status/{status}")
    @Operation(summary = "Get farmers by status")
    public ResponseEntity<ApiResponse<List<FarmerResponseDto>>> getFarmersByStatus(
            @PathVariable Farmer.FarmerStatus status) {

        LOGGER.info("Fetching farmers with status {}", status);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Farmers fetched by status",
                        adminFarmerService.getFarmersByStatus(status)
                )
        );
    }

    // 🔥 UPDATE FARMER
    @PutMapping("/{id}")
    @Operation(summary = "Update farmer profile")
    public ResponseEntity<ApiResponse<FarmerResponseDto>> updateFarmer(
            @PathVariable Long id,
            @Valid @RequestBody FarmerRequestDto requestDto) {

        LOGGER.info("Updating farmer {}", id);

        FarmerResponseDto response =
                adminFarmerService.updateFarmer(id, requestDto);

        return ResponseEntity.ok(
                ApiResponse.success("Farmer updated", response));
    }

    // 🔥 UPDATE FARMER STATUS (FIXED)
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update farmer status")
    public ResponseEntity<ApiResponse<FarmerResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam Farmer.FarmerStatus status) {

        LOGGER.info("Updating status for farmer {}", id);

        FarmerResponseDto response =
                adminFarmerService.updateFarmerStatus(id, status);

        return ResponseEntity.ok(
                ApiResponse.success("Status updated", response));
    }

    // 🔥 UPDATE RATING (KEPT)
    @PatchMapping("/{id}/rating")
    @Operation(summary = "Update farmer rating")
    public ResponseEntity<ApiResponse<FarmerResponseDto>> updateRating(
            @PathVariable Long id,
            @RequestParam Double rating) {

        LOGGER.info("Updating rating for farmer {}", id);

        FarmerResponseDto response =
                adminFarmerService.updateRating(id, rating);

        return ResponseEntity.ok(
                ApiResponse.success("Rating updated", response));
    }

    // 🔥 DELETE FARMER
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete farmer")
    public ResponseEntity<ApiResponse<Void>> deleteFarmer(
            @PathVariable Long id) {

        LOGGER.warn("Deleting farmer {}", id);

        adminFarmerService.deleteFarmer(id);

        return ResponseEntity.ok(
                ApiResponse.success("Farmer deleted", null));
    }
}