package com.cropdeal.admin.usermanagement.service.impl;

import com.cropdeal.admin.usermanagement.dto.DealerRequestDto;
import com.cropdeal.admin.usermanagement.dto.DealerResponseDto;
import com.cropdeal.admin.usermanagement.entity.Dealer;
import com.cropdeal.admin.usermanagement.exception.ResourceNotFoundException;
import com.cropdeal.admin.usermanagement.repository.DealerRepository;
import com.cropdeal.admin.usermanagement.service.DealerManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DealerManagementServiceImpl
        implements DealerManagementService {

    private final DealerRepository dealerRepository;

    @Override
    public DealerResponseDto createDealer(DealerRequestDto dto) {

        Dealer dealer = Dealer.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .state(dto.getState())
                .district(dto.getDistrict())
                .businessName(dto.getBusinessName())
                .gstNumber(dto.getGstNumber())
                .bankAccountNumber(dto.getBankAccountNumber())
                .bankName(dto.getBankName())
                .ifscCode(dto.getIfscCode())
                .status("ACTIVE")
                .totalPurchaseAmount(0.0)
                .totalCropsPurchased(0)
                .registeredAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToDto(
                dealerRepository.save(dealer));
    }

    @Override
    public List<DealerResponseDto> getAllDealers() {

        return dealerRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public DealerResponseDto getDealer(Long id) {

        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Dealer not found"));

        return mapToDto(dealer);
    }

    @Override
    public DealerResponseDto updateDealer(
            Long id,
            DealerRequestDto dto) {

        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Dealer not found"));

        dealer.setFirstName(dto.getFirstName());
        dealer.setLastName(dto.getLastName());
        dealer.setEmail(dto.getEmail());
        dealer.setPhone(dto.getPhone());
        dealer.setAddress(dto.getAddress());
        dealer.setState(dto.getState());
        dealer.setDistrict(dto.getDistrict());
        dealer.setBusinessName(dto.getBusinessName());
        dealer.setGstNumber(dto.getGstNumber());
        dealer.setBankAccountNumber(dto.getBankAccountNumber());
        dealer.setBankName(dto.getBankName());
        dealer.setIfscCode(dto.getIfscCode());
        dealer.setUpdatedAt(LocalDateTime.now());

        return mapToDto(
                dealerRepository.save(dealer));
    }

    private DealerResponseDto mapToDto(Dealer dealer) {

        return DealerResponseDto.builder()
                .id(dealer.getId())
                .firstName(dealer.getFirstName())
                .lastName(dealer.getLastName())
                .email(dealer.getEmail())
                .phone(dealer.getPhone())
                .address(dealer.getAddress())
                .state(dealer.getState())
                .district(dealer.getDistrict())
                .businessName(dealer.getBusinessName())
                .gstNumber(dealer.getGstNumber())
                .bankAccountNumber(dealer.getBankAccountNumber())
                .bankName(dealer.getBankName())
                .ifscCode(dealer.getIfscCode())
                .status(dealer.getStatus())
                .totalPurchaseAmount(dealer.getTotalPurchaseAmount())
                .totalCropsPurchased(dealer.getTotalCropsPurchased())
                .registeredAt(dealer.getRegisteredAt())
                .updatedAt(dealer.getUpdatedAt())
                .build();
    }
}