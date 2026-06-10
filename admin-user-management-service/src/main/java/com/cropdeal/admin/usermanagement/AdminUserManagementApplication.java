package com.cropdeal.admin.usermanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients; // ✅ ADD THIS

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients   // 🔥 ADD THIS LINE
public class AdminUserManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminUserManagementApplication.class, args);
    }
}