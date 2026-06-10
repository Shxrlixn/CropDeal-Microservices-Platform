package com.cropdeal.orderservice.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class OrderTest {

    @Test
    void testOrderGettersAndSetters() {

        Order order = new Order();

        order.setId(1);
        order.setCropId(101);
        order.setFarmerId(201);
        order.setDealerId(301);
        order.setQuantity(50);
        order.setPrice(1200.50);
        order.setTotalAmount(60025.00);

        assertEquals(1, order.getId());
        assertEquals(101, order.getCropId());
        assertEquals(201, order.getFarmerId());
        assertEquals(301, order.getDealerId());
        assertEquals(50, order.getQuantity());
        assertEquals(1200.50, order.getPrice());
        assertEquals(60025.00, order.getTotalAmount());
    }
}