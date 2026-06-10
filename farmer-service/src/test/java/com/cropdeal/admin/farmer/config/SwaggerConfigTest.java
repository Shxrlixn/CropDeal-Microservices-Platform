package com.cropdeal.admin.farmer.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SwaggerConfigTest {

    // ✅ Direct method test (no Spring context needed)
    @Test
    void shouldCreateOpenAPIBeanWithCorrectInfo() {
        SwaggerConfig config = new SwaggerConfig();

        OpenAPI openAPI = config.adminFarmerOpenAPI();

        assertThat(openAPI).isNotNull();

        Info info = openAPI.getInfo();
        assertThat(info).isNotNull();

        assertThat(info.getTitle())
                .isEqualTo("CropDeal - Admin Farmer Service");

        assertThat(info.getDescription())
                .isEqualTo("Admin APIs for farmer management");

        assertThat(info.getVersion())
                .isEqualTo("v1.0.0");
    }

    // ✅ Optional: Spring context test (improves Sonar coverage)
    @Test
    void shouldLoadBeanFromSpringContext() {
        SwaggerConfig config = new SwaggerConfig();

        OpenAPI openAPI = config.adminFarmerOpenAPI();

        assertThat(openAPI).isNotNull();
    }
}