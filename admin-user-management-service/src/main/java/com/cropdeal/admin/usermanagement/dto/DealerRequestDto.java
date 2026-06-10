package com.cropdeal.admin.usermanagement.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DealerRequestDto {

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
}