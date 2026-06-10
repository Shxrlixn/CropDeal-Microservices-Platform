package com.cropdeal.admin.farmer.service;

import com.cropdeal.admin.farmer.dto.FarmerRequestDto;
import com.cropdeal.admin.farmer.dto.FarmerResponseDto;
import com.cropdeal.admin.farmer.entity.Farmer;
import java.util.List;

public interface AdminFarmerService {

    FarmerResponseDto addFarmer(FarmerRequestDto requestDto);

    FarmerResponseDto getFarmerById(Long id);

    List<FarmerResponseDto> getAllFarmers();

    List<FarmerResponseDto> getFarmersByStatus(Farmer.FarmerStatus status);

    FarmerResponseDto updateFarmer(Long id, FarmerRequestDto requestDto);

    FarmerResponseDto updateFarmerStatus(Long id, Farmer.FarmerStatus status);

    FarmerResponseDto updateRating(Long id, Double rating); // ✅ KEEP THIS

    void deleteFarmer(Long id);

    List<FarmerResponseDto> getActiveFarmers();

    List<FarmerResponseDto> getInactiveFarmers();
}