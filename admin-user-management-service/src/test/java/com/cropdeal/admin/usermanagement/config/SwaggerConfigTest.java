package com.cropdeal.admin.usermanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SwaggerConfigTest {

    private final SwaggerConfig swaggerConfig =
            new SwaggerConfig();

    @Test
    void shouldCreateOpenAPIBeanCorrectly() {

        OpenAPI openAPI =
                swaggerConfig.adminUserManagementOpenAPI();

        assertThat(openAPI)
                .isNotNull();

        Info info = openAPI.getInfo();

        assertThat(info)
                .isNotNull();

        assertThat(info.getTitle())
                .isEqualTo(
                        "CropDeal - Admin User Management Service"
                );

        assertThat(info.getDescription())
                .isEqualTo(
                        "Manages farmers and dealers: "
                        + "edit profiles, Active/Inactive toggle, "
                        + "ratings/reviews, Excel export"
                );

        assertThat(info.getVersion())
                .isEqualTo("v1.0.0");
    }
}