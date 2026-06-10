package com.cropdeal.admin.farmer.dto;

import com.cropdeal.admin.farmer.entity.Farmer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerRequestDto {
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
}