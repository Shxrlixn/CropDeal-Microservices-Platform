package com.cropdeal.userservice;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserServiceApplicationTest {

    @Test
    void contextLoads() {
        // Verifies that the Spring context loads successfully
    }

    @Test
    void mainMethodRunsSuccessfully() {

        assertDoesNotThrow(() ->
                UserServiceApplication.main(new String[] {}));
    }
}