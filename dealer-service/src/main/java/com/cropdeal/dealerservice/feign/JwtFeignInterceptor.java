package com.cropdeal.dealerservice.feign;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtFeignInterceptor {

    @Bean
    public RequestInterceptor requestInterceptor() {

        return template -> {

            String token = TokenHolder.getToken();

            if (token != null && !token.isBlank()) {
                template.header("Authorization", token);
            }
        };
    }
}