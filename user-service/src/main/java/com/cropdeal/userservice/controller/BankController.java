package com.cropdeal.userservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cropdeal.userservice.dto.BankDTO;
import com.cropdeal.userservice.entity.BankDetails;
import com.cropdeal.userservice.repository.BankRepository;

@RestController
@RequestMapping("/api/v1/bank")
public class BankController {

    private final BankRepository bankRepository;

    public BankController(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }


    @PostMapping
    public ResponseEntity<BankDTO> addBank(
            @RequestBody BankDTO bankDTO) {

        BankDetails savedBank =
                bankRepository.save(convertToEntity(bankDTO));

        return ResponseEntity.ok(convertToDTO(savedBank));
    }


    @GetMapping("/{userId}")
    public ResponseEntity<BankDTO> getBank(
            @PathVariable int userId) {

        BankDetails bank =
                bankRepository.findByUserId(userId);

        if (bank == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(convertToDTO(bank));
    }


    private BankDTO convertToDTO(BankDetails bank) {

        return new BankDTO(
                bank.getId(),
                bank.getUserId(),
                bank.getAccountNumber(),
                bank.getIfscCode(),
                bank.getBankName()
        );
    }


    private BankDetails convertToEntity(BankDTO dto) {

        BankDetails bank = new BankDetails();

        bank.setId(dto.getId());
        bank.setUserId(dto.getUserId());
        bank.setAccountNumber(dto.getAccountNumber());
        bank.setIfscCode(dto.getIfscCode());
        bank.setBankName(dto.getBankName());

        return bank;
    }
}