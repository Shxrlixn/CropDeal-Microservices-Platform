package com.cropdeal.dealerservice.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.cropdeal.dealerservice.dto.CropResponse;

@FeignClient(name = "CROP-SERVICE") // matches Eureka service name
public interface CropClient {

    // ✅ Get all crops (direct service-to-service call)
    @GetMapping("/api/v1/crops")
    List<CropResponse> getAllCrops();

    // ✅ Buy crop (reduce quantity)
    @PostMapping("/api/v1/crops/buy/{id}/{qty}")
    CropResponse buyCrop(@PathVariable("id") int id,
                         @PathVariable("qty") int qty);
}