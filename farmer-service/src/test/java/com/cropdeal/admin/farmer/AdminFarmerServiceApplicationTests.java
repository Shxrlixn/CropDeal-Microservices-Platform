package com.cropdeal.admin.farmer;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

class AdminFarmerServiceApplicationTests {

    @Test
    void mainMethodRuns() {

        AdminFarmerServiceApplication application =
                new AdminFarmerServiceApplication();

        assertNotNull(application);
    }
}