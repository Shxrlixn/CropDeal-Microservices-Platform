package com.cropdeal.admin.farmer.mapper;

import com.cropdeal.admin.farmer.dto.FarmerRequestDto;
import com.cropdeal.admin.farmer.dto.FarmerResponseDto;
import com.cropdeal.admin.farmer.entity.Farmer;
import org.springframework.stereotype.Component;

@Component
public class FarmerMapper {

    public Farmer toEntity(FarmerRequestDto dto) {

        Farmer farmer = new Farmer();

        farmer.setFirstName(dto.getFirstName());
        farmer.setLastName(dto.getLastName());
        farmer.setEmail(dto.getEmail());
        farmer.setPhone(dto.getPhone());
        farmer.setAddress(dto.getAddress());
        farmer.setState(dto.getState());
        farmer.setDistrict(dto.getDistrict());
        farmer.setAadharNumber(dto.getAadharNumber());
        farmer.setBankAccountNumber(dto.getBankAccountNumber());
        farmer.setBankName(dto.getBankName());
        farmer.setIfscCode(dto.getIfscCode());

        farmer.setStatus(
                dto.getStatus() != null
                        ? dto.getStatus()
                        : Farmer.FarmerStatus.ACTIVE
        );

        return farmer;
    }


    public FarmerResponseDto toResponseDto(Farmer farmer) {

        FarmerResponseDto dto = new FarmerResponseDto();

        dto.setId(farmer.getId());
        dto.setFirstName(farmer.getFirstName());
        dto.setLastName(farmer.getLastName());
        dto.setEmail(farmer.getEmail());
        dto.setPhone(farmer.getPhone());
        dto.setAddress(farmer.getAddress());
        dto.setState(farmer.getState());
        dto.setDistrict(farmer.getDistrict());
        dto.setAadharNumber(farmer.getAadharNumber());
        dto.setBankAccountNumber(farmer.getBankAccountNumber());
        dto.setBankName(farmer.getBankName());
        dto.setIfscCode(farmer.getIfscCode());
        dto.setStatus(farmer.getStatus());
        dto.setRating(farmer.getRating());
        dto.setTotalCropsSold(farmer.getTotalCropsSold());
        dto.setRegisteredAt(farmer.getRegisteredAt());
        dto.setUpdatedAt(farmer.getUpdatedAt());

        return dto;
    }


    public void updateEntityFromDto(
            FarmerRequestDto dto,
            Farmer farmer
    ) {

        if (dto.getFirstName() != null)
            farmer.setFirstName(dto.getFirstName());

        if (dto.getLastName() != null)
            farmer.setLastName(dto.getLastName());

        if (dto.getEmail() != null)
            farmer.setEmail(dto.getEmail());

        if (dto.getPhone() != null)
            farmer.setPhone(dto.getPhone());

        if (dto.getAddress() != null)
            farmer.setAddress(dto.getAddress());

        if (dto.getState() != null)
            farmer.setState(dto.getState());

        if (dto.getDistrict() != null)
            farmer.setDistrict(dto.getDistrict());

        if (dto.getBankAccountNumber() != null)
            farmer.setBankAccountNumber(dto.getBankAccountNumber());

        if (dto.getBankName() != null)
            farmer.setBankName(dto.getBankName());

        if (dto.getIfscCode() != null)
            farmer.setIfscCode(dto.getIfscCode());

        if (dto.getStatus() != null)
            farmer.setStatus(dto.getStatus());
    }
}