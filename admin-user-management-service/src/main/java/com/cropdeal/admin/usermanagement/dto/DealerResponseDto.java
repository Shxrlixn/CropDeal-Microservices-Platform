package com.cropdeal.admin.usermanagement.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DealerResponseDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String state;
    private String district;
    private String businessName;
    private String gstNumber;
    private String bankAccountNumber;
    private String bankName;
    private String ifscCode;

    private String status; // ✅ FIXED

    private Double totalPurchaseAmount;
    private Integer totalCropsPurchased;
    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;
}