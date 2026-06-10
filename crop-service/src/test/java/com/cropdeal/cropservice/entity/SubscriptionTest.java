package com.cropdeal.cropservice.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SubscriptionTest {

    @Test
    void testSubscriptionGettersAndSetters() {

        Subscription subscription = new Subscription();

        subscription.setDealerId(101);
        subscription.setCropType("Wheat");

        assertEquals(101, subscription.getDealerId());
        assertEquals("Wheat", subscription.getCropType());
    }


    @Test
    void testDefaultIdValue() {

        Subscription subscription = new Subscription();

        // Before persistence, id should remain default (0)
        assertEquals(0, subscription.getId());
    }
}