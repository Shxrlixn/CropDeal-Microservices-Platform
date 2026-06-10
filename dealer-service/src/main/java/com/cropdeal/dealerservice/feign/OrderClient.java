package com.cropdeal.dealerservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.cropdeal.dealerservice.dto.OrderRequest;

@FeignClient(name = "ORDER-SERVICE")
public interface OrderClient {

    @PostMapping("/api/orders")   // ✅ FIXED
    Object createOrder(@RequestBody OrderRequest order);
}
