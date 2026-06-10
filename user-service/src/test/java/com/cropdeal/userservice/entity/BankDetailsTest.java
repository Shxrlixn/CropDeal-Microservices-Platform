package com.cropdeal.userservice.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class BankDetailsTest {

    @Test
    void testBankDetailsGettersAndSetters() {

        BankDetails bankDetails = new BankDetails();

        bankDetails.setId(1);
        bankDetails.setUserId(101);
        bankDetails.setAccountNumber("1234567890");
        bankDetails.setIfscCode("SBIN0001234");
        bankDetails.setBankName("State Bank");

        assertEquals(1, bankDetails.getId());
        assertEquals(101, bankDetails.getUserId());
        assertEquals("1234567890", bankDetails.getAccountNumber());
        assertEquals("SBIN0001234", bankDetails.getIfscCode());
        assertEquals("State Bank", bankDetails.getBankName());
    }

    @Test
    void testDefaultConstructor() {

        BankDetails bankDetails = new BankDetails();

        assertNotNull(bankDetails);
    }
}