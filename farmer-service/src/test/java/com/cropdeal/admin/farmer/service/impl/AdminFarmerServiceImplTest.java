package com.cropdeal.admin.farmer.service.impl;

import com.cropdeal.admin.farmer.dto.FarmerRequestDto;
import com.cropdeal.admin.farmer.dto.FarmerResponseDto;
import com.cropdeal.admin.farmer.entity.Farmer;
import com.cropdeal.admin.farmer.exception.FarmerAlreadyExistsException;
import com.cropdeal.admin.farmer.exception.FarmerNotFoundException;
import com.cropdeal.admin.farmer.mapper.FarmerMapper;
import com.cropdeal.admin.farmer.repository.AdminFarmerRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminFarmerServiceImplTest {

    private AdminFarmerServiceImpl service;

    @Mock
    private AdminFarmerRepository repository;

    private FarmerMapper mapper;


    @BeforeEach
    void setup() {

        MockitoAnnotations.openMocks(this);

        mapper = new FarmerMapper();

        service = new AdminFarmerServiceImpl(
                repository,
                mapper
        );
    }


    @Test
    void shouldAddFarmerSuccessfully() {

        FarmerRequestDto dto = new FarmerRequestDto();
        dto.setEmail("test@gmail.com");
        dto.setAadharNumber("123412341234");

        Farmer savedFarmer = new Farmer();
        savedFarmer.setId(1L);

        when(repository.existsByEmail(dto.getEmail()))
                .thenReturn(false);

        when(repository.existsByAadharNumber(dto.getAadharNumber()))
                .thenReturn(false);

        when(repository.save(any(Farmer.class)))
                .thenReturn(savedFarmer);


        FarmerResponseDto result =
                service.addFarmer(dto);


        assertNotNull(result);
        verify(repository).save(any(Farmer.class));
    }


    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        FarmerRequestDto dto = new FarmerRequestDto();
        dto.setEmail("exists@gmail.com");

        when(repository.existsByEmail(dto.getEmail()))
                .thenReturn(true);


        assertThrows(
                FarmerAlreadyExistsException.class,
                () -> service.addFarmer(dto)
        );

        verify(repository, never())
                .save(any(Farmer.class));
    }


    @Test
    void shouldThrowExceptionWhenAadharAlreadyExists() {

        FarmerRequestDto dto = new FarmerRequestDto();
        dto.setEmail("new@gmail.com");
        dto.setAadharNumber("999999999999");

        when(repository.existsByEmail(dto.getEmail()))
                .thenReturn(false);

        when(repository.existsByAadharNumber(dto.getAadharNumber()))
                .thenReturn(true);


        assertThrows(
                FarmerAlreadyExistsException.class,
                () -> service.addFarmer(dto)
        );

        verify(repository, never())
                .save(any(Farmer.class));
    }


    @Test
    void shouldReturnFarmerWhenIdExists() {

        Farmer farmer = new Farmer();
        farmer.setId(1L);

        when(repository.findById(1L))
                .thenReturn(Optional.of(farmer));


        FarmerResponseDto response =
                service.getFarmerById(1L);


        assertNotNull(response);
        verify(repository).findById(1L);
    }


    @Test
    void shouldThrowExceptionWhenFarmerNotFound() {

        when(repository.findById(1L))
                .thenReturn(Optional.empty());


        assertThrows(
                FarmerNotFoundException.class,
                () -> service.getFarmerById(1L)
        );

        verify(repository).findById(1L);
    }
}