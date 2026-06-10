package com.cropdeal.orderservice.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class PaymentTest {

    @Test
    void testPaymentGettersAndSetters() {

        Payment payment = new Payment();

        payment.setId(1);
        payment.setOrderId(101);
        payment.setAmount(2500.75);
        payment.setStatus("SUCCESS");

        assertEquals(1, payment.getId());
        assertEquals(101, payment.getOrderId());
        assertEquals(2500.75, payment.getAmount());
        assertEquals("SUCCESS", payment.getStatus());
    }
}