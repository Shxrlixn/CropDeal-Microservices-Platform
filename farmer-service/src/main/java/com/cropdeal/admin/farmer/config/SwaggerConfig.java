package com.cropdeal.admin.farmer.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI adminFarmerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CropDeal - Admin Farmer Service")
                        .description("Admin APIs for farmer management")
                        .version("v1.0.0"));
    }
}