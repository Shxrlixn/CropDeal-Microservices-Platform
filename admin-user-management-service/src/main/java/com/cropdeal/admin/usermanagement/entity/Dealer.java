package com.cropdeal.admin.usermanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "dealers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dealer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true)
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

    private String status;

    private Double totalPurchaseAmount;

    private Integer totalCropsPurchased;

    private LocalDateTime registeredAt;

    private LocalDateTime updatedAt;
}