package com.cropdeal.admin.farmer.service.impl;

import com.cropdeal.admin.farmer.dto.FarmerRequestDto;
import com.cropdeal.admin.farmer.dto.FarmerResponseDto;
import com.cropdeal.admin.farmer.entity.Farmer;
import com.cropdeal.admin.farmer.exception.FarmerNotFoundException;
import com.cropdeal.admin.farmer.mapper.FarmerMapper;
import com.cropdeal.admin.farmer.repository.AdminFarmerRepository;
import com.cropdeal.admin.farmer.service.AdminFarmerService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminFarmerServiceImpl implements AdminFarmerService {

    private final AdminFarmerRepository repository;
    private final FarmerMapper farmerMapper;

    // ✅ constant to remove duplication
    private static final String FARMER_NOT_FOUND = "Farmer not found";

    public AdminFarmerServiceImpl(AdminFarmerRepository repository,
                                 FarmerMapper farmerMapper) {
        this.repository = repository;
        this.farmerMapper = farmerMapper;
    }

    // ✅ ADD FARMER
    @Override
    public FarmerResponseDto addFarmer(FarmerRequestDto requestDto) {
        Farmer farmer = farmerMapper.toEntity(requestDto);
        Farmer savedFarmer = repository.save(farmer);
        return farmerMapper.toResponseDto(savedFarmer);
    }

    // ✅ GET BY ID
    @Override
    public FarmerResponseDto getFarmerById(Long id) {
        Farmer farmer = repository.findById(id)
                .orElseThrow(() -> new FarmerNotFoundException(FARMER_NOT_FOUND));

        return farmerMapper.toResponseDto(farmer);
    }

    // ✅ GET ALL
    @Override
    public List<FarmerResponseDto> getAllFarmers() {
        return repository.findAll()
                .stream()
                .map(farmerMapper::toResponseDto)
                .toList(); // ✅ Sonar fix
    }

    // ✅ ACTIVE
    @Override
    public List<FarmerResponseDto> getActiveFarmers() {
        return repository.findByStatus(Farmer.FarmerStatus.ACTIVE)
                .stream()
                .map(farmerMapper::toResponseDto)
                .toList();
    }

    // ✅ INACTIVE
    @Override
    public List<FarmerResponseDto> getInactiveFarmers() {
        return repository.findByStatus(Farmer.FarmerStatus.INACTIVE)
                .stream()
                .map(farmerMapper::toResponseDto)
                .toList();
    }

    // ✅ BY STATUS
    @Override
    public List<FarmerResponseDto> getFarmersByStatus(Farmer.FarmerStatus status) {
        return repository.findByStatus(status)
                .stream()
                .map(farmerMapper::toResponseDto)
                .toList();
    }

    // ✅ UPDATE FARMER
    @Override
    public FarmerResponseDto updateFarmer(Long id, FarmerRequestDto requestDto) {

        Farmer farmer = repository.findById(id)
                .orElseThrow(() -> new FarmerNotFoundException(FARMER_NOT_FOUND));

        farmerMapper.updateEntityFromDto(requestDto, farmer);

        Farmer updatedFarmer = repository.save(farmer);

        return farmerMapper.toResponseDto(updatedFarmer);
    }

    // ✅ UPDATE STATUS
    @Override
    public FarmerResponseDto updateFarmerStatus(Long id,
                                                Farmer.FarmerStatus status) {

        Farmer farmer = repository.findById(id)
                .orElseThrow(() -> new FarmerNotFoundException(FARMER_NOT_FOUND));

        farmer.setStatus(status);

        Farmer updated = repository.save(farmer);

        return farmerMapper.toResponseDto(updated);
    }

    // ✅ UPDATE RATING (FIXED EXCEPTION)
    @Override
    public FarmerResponseDto updateRating(Long id, Double rating) {

        if (rating == null || rating < 0 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 0 and 5");
        }

        Farmer farmer = repository.findById(id)
                .orElseThrow(() -> new FarmerNotFoundException(FARMER_NOT_FOUND));

        farmer.setRating(rating);

        Farmer updated = repository.save(farmer);

        return farmerMapper.toResponseDto(updated);
    }

    // ✅ DELETE
    @Override
    public void deleteFarmer(Long id) {

        if (!repository.existsById(id)) {
            throw new FarmerNotFoundException(FARMER_NOT_FOUND);
        }

        repository.deleteById(id);
    }
}