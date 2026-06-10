package com.cropdeal.admin.usermanagement.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerResponseDto {

    private Long id;

    private String firstName;
    private String lastName;

    private String email;
    private String phone;

    private String address;
    private String state;
    private String district;

    private String aadharNumber;

    private String bankAccountNumber;
    private String bankName;
    private String ifscCode;

    private String status; // ACTIVE / INACTIVE

    private Double rating;
    private String review;

    private Integer totalCropsSold;

    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;
}