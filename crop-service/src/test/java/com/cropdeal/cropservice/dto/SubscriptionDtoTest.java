package com.cropdeal.cropservice.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SubscriptionDtoTest {

    @Test
    void testSubscriptionDtoGettersAndSetters() {

        SubscriptionDto dto = new SubscriptionDto();

        dto.setId(5);
        dto.setDealerId(200);
        dto.setCropType("Rice");

        assertEquals(5, dto.getId());
        assertEquals(200, dto.getDealerId());
        assertEquals("Rice", dto.getCropType());
    }
}