package com.cropdeal.orderservice.dto;

import com.cropdeal.orderservice.entity.Order;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderDTOTest {

    @Test
    void testDefaultConstructorAndSetters() {

        OrderDTO dto = new OrderDTO();

        dto.setId(1);
        dto.setFarmerId(10);
        dto.setDealerId(20);
        dto.setCropId(30);
        dto.setQuantity(5);
        dto.setPrice(100.0);
        dto.setTotalAmount(500.0);

        assertEquals(1, dto.getId());
        assertEquals(10, dto.getFarmerId());
        assertEquals(20, dto.getDealerId());
        assertEquals(30, dto.getCropId());
        assertEquals(5, dto.getQuantity());
        assertEquals(100.0, dto.getPrice());
        assertEquals(500.0, dto.getTotalAmount());
    }


    @Test
    void testConstructorFromOrderEntity() {

        Order order = new Order();

        order.setId(2);
        order.setFarmerId(11);
        order.setDealerId(21);
        order.setCropId(31);
        order.setQuantity(6);
        order.setPrice(200.0);
        order.setTotalAmount(1200.0);

        OrderDTO dto = new OrderDTO(order);

        assertEquals(2, dto.getId());
        assertEquals(11, dto.getFarmerId());
        assertEquals(21, dto.getDealerId());
        assertEquals(31, dto.getCropId());
        assertEquals(6, dto.getQuantity());
        assertEquals(200.0, dto.getPrice());
        assertEquals(1200.0, dto.getTotalAmount());
    }
}