package com.cropdeal.cropservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class SwaggerConfigTest {

    @Test
    void shouldCreateOpenAPIBeanCorrectly() {

        try (AnnotationConfigApplicationContext context =
                     new AnnotationConfigApplicationContext(SwaggerConfig.class)) {

            OpenAPI openAPI = context.getBean(OpenAPI.class);

            assertThat(openAPI).isNotNull();

            Info info = openAPI.getInfo();
            assertThat(info).isNotNull();

            String title = info.getTitle();
            String version = info.getVersion();

            assertThat(title).isNotBlank();
            assertThat(version).isNotBlank();

            var components = openAPI.getComponents();

            if (components != null &&
                components.getSecuritySchemes() != null &&
                !components.getSecuritySchemes().isEmpty()) {

                Map<String, SecurityScheme> schemes = components.getSecuritySchemes();

                SecurityScheme scheme = schemes.values().iterator().next();

                SecurityScheme.Type type = scheme.getType();
                String schemeValue = scheme.getScheme();
                String bearerFormat = scheme.getBearerFormat();

                assertThat(type).isEqualTo(SecurityScheme.Type.HTTP);
                assertThat(schemeValue).isEqualToIgnoringCase("bearer");

                if (bearerFormat != null) {
                    assertThat(bearerFormat).isEqualToIgnoringCase("JWT");
                }
            }
        }
    }
}