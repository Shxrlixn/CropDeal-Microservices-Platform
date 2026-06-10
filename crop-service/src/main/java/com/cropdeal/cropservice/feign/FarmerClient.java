package com.cropdeal.cropservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import com.cropdeal.cropservice.dto.FarmerResponseDto;

@FeignClient(name = "FARMER-SERVICE")
public interface FarmerClient {

    @GetMapping("/api/v1/admin/farmers/{id}")
    FarmerResponseDto getFarmer(@PathVariable Long id);
}