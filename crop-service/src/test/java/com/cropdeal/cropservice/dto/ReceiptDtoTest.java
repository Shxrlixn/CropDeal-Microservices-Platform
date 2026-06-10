package com.cropdeal.cropservice.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ReceiptDtoTest {

    @Test
    void testReceiptDtoGettersAndSetters() {

        ReceiptDto dto = new ReceiptDto();

        dto.setId(10);
        dto.setQuantity(5);
        dto.setPrice(200.75);
        dto.setTotalAmount(1003.75);

        assertEquals(10, dto.getId());
        assertEquals(5, dto.getQuantity());
        assertEquals(200.75, dto.getPrice());
        assertEquals(1003.75, dto.getTotalAmount());
    }
}