package com.cropdeal.userservice.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.cropdeal.userservice.dto.BankDTO;
import com.cropdeal.userservice.entity.BankDetails;
import com.cropdeal.userservice.repository.BankRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

class BankControllerTest {

    private BankController bankController;

    @Mock
    private BankRepository bankRepository;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        bankController = new BankController(bankRepository);
    }

    @Test
    void testAddBank() {

        BankDTO inputDto =
        		new BankDTO(1, 1, "1234567890", "SBIN0001234", "SBI");

        BankDetails savedEntity = new BankDetails();
        savedEntity.setId(1);
        savedEntity.setUserId(1);
        savedEntity.setAccountNumber("1234567890");
        savedEntity.setIfscCode("SBIN0001234");
        savedEntity.setBankName("SBI");

        when(bankRepository.save(org.mockito.ArgumentMatchers.any()))
                .thenReturn(savedEntity);

        ResponseEntity<BankDTO> response =
                bankController.addBank(inputDto);

        assertEquals(1, response.getBody().getUserId());
    }

    @Test
    void testGetBank() {

        BankDetails entity = new BankDetails();
        entity.setId(1);
        entity.setUserId(1);
        entity.setAccountNumber("1234567890");
        entity.setIfscCode("SBIN0001234");
        entity.setBankName("SBI");

        when(bankRepository.findByUserId(1))
                .thenReturn(entity);

        ResponseEntity<BankDTO> response =
                bankController.getBank(1);

        assertEquals(1, response.getBody().getUserId());
    }
}