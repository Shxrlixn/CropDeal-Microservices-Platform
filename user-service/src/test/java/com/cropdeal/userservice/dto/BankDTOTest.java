package com.cropdeal.userservice.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class BankDTOTest {

    @Test
    void testConstructorAndGetters() {

        BankDTO bankDTO = new BankDTO(
                1,
                101,
                "1234567890",
                "SBIN0001234",
                "State Bank"
        );

        assertEquals(1, bankDTO.getId());
        assertEquals(101, bankDTO.getUserId());
        assertEquals("1234567890", bankDTO.getAccountNumber());
        assertEquals("SBIN0001234", bankDTO.getIfscCode());
        assertEquals("State Bank", bankDTO.getBankName());
    }
}