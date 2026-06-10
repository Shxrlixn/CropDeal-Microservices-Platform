package com.cropdeal.admin.usermanagement.dto;

import lombok.*;

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

    private String status;
    private Double rating;
    private String review;
}