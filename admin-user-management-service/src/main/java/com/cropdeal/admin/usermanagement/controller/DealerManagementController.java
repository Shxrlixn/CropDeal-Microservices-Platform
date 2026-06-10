package com.cropdeal.admin.usermanagement.controller;

import com.cropdeal.admin.usermanagement.dto.*;
import com.cropdeal.admin.usermanagement.service.DealerManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

// ✅ SUPPORTS ANGULAR URL
@RequestMapping({
        "/api/admin/dealers",
        "/api/v1/admin/dealers"
})
@RequiredArgsConstructor
public class DealerManagementController {

    private final DealerManagementService dealerService;

    // ✅ CREATE DEALER
    @PostMapping
    public ResponseEntity<ApiResponse<DealerResponseDto>>
    createDealer(@RequestBody DealerRequestDto dto) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Dealer created successfully",
                        dealerService.createDealer(dto)
                )
        );
    }

    // ✅ GET ALL DEALERS
    @GetMapping
    public ResponseEntity<ApiResponse<List<DealerResponseDto>>>
    getAllDealers() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "All dealers fetched",
                        dealerService.getAllDealers()
                )
        );
    }

    // ✅ GET DEALER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DealerResponseDto>>
    getDealer(@PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Dealer fetched",
                        dealerService.getDealer(id)
                )
        );
    }

    // ✅ UPDATE DEALER
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DealerResponseDto>>
    updateDealer(
            @PathVariable Long id,
            @RequestBody DealerRequestDto dto) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Dealer updated successfully",
                        dealerService.updateDealer(id, dto)
                )
        );
    }
}