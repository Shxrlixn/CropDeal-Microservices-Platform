package com.cropdeal.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * CropDeal API Gateway.
 * <p>
 * Single entry-point for all client requests.
 * Routes traffic to downstream microservices via Eureka service discovery
 * with client-side load balancing (ALB pattern using Spring Cloud LoadBalancer).
 * </p>
 */
@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}