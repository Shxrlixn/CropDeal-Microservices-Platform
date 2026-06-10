package com.cropdeal.admin.farmer.dto;

import com.cropdeal.admin.farmer.entity.Farmer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    private Farmer.FarmerStatus status;
    private Double rating;
    private Integer totalCropsSold;
    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;
}