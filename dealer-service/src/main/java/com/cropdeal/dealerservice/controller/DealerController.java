package com.cropdeal.dealerservice.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import com.cropdeal.dealerservice.dto.CropResponse;
import com.cropdeal.dealerservice.service.DealerService;

@RestController
@RequestMapping("/dealer")
public class DealerController {

    private static final Logger logger =
            LoggerFactory.getLogger(DealerController.class);

    private final DealerService dealerService;

    public DealerController(DealerService dealerService) {
        this.dealerService = dealerService;
    }

    // GET ALL CROPS
    @GetMapping("/crops")
    public List<CropResponse> getCrops() {

        logger.info("Fetching crops");

        return dealerService.getAllCrops();
    }

    // BUY CROP
    @PostMapping("/buy/{id}/{qty}")
    public String buy(
            @PathVariable int id,
            @PathVariable int qty
    ) {

        dealerService.buyCrop(id, qty);

        return "Purchase successful";
    }
}