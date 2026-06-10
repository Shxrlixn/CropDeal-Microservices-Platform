package com.cropdeal.cropservice.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ReceiptTest {

    @Test
    void testReceiptGettersAndSetters() {

        Receipt receipt = new Receipt();

        receipt.setId(1);
        receipt.setFarmerId(101);
        receipt.setCropName("Wheat");
        receipt.setQuantity(25);
        receipt.setPrice(2000.50);
        receipt.setTotalAmount(50012.50);

        assertEquals(1, receipt.getId());
        assertEquals(101, receipt.getFarmerId());
        assertEquals("Wheat", receipt.getCropName());
        assertEquals(25, receipt.getQuantity());
        assertEquals(2000.50, receipt.getPrice());
        assertEquals(50012.50, receipt.getTotalAmount());
    }
}