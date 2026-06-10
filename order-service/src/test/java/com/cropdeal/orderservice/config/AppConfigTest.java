package com.cropdeal.orderservice.config;

import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

class AppConfigTest {

    @Test
    void testRestTemplateBeanCreation() {

        AppConfig appConfig = new AppConfig();

        RestTemplate restTemplate = appConfig.restTemplate();

        assertNotNull(restTemplate);
        assertTrue(restTemplate instanceof RestTemplate);
    }
}