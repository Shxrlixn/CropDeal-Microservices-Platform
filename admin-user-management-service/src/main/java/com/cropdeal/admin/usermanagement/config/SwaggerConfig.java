package com.cropdeal.admin.usermanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI adminUserManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CropDeal - Admin User Management Service")
                        .description(
                            "Manages farmers and dealers: "
                            + "edit profiles, Active/Inactive toggle, "
                            + "ratings/reviews, Excel export")
                        .version("v1.0.0"));
    }
}