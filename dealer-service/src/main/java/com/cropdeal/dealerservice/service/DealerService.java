package com.cropdeal.dealerservice.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.cropdeal.dealerservice.dto.CropResponse;
import com.cropdeal.dealerservice.dto.OrderRequest;
import com.cropdeal.dealerservice.exception.CropNotFoundException;
import com.cropdeal.dealerservice.feign.CropClient;
import com.cropdeal.dealerservice.feign.OrderClient;

@Service
public class DealerService {

    private static final Logger logger =
            LoggerFactory.getLogger(DealerService.class);

    private final CropClient cropClient;
    private final OrderClient orderClient;

    public DealerService(
            CropClient cropClient,
            OrderClient orderClient
    ) {
        this.cropClient = cropClient;
        this.orderClient = orderClient;
    }

    // GET ALL CROPS
    public List<CropResponse> getAllCrops() {

        logger.info("Fetching crops from crop-service");

        return cropClient.getAllCrops();
    }

    // BUY FLOW
    public void buyCrop(int cropId, int qty) {

        CropResponse crop =
                cropClient.buyCrop(cropId, qty);

        if (crop == null) {

            throw new CropNotFoundException(
                    "Crop not found or insufficient quantity"
            );
        }

        OrderRequest order =
                new OrderRequest();

        order.setCropId(cropId);
        order.setFarmerId(crop.getFarmerId());
        order.setDealerId(1);
        order.setQuantity(qty);
        order.setPrice(crop.getPrice());
        order.setTotalAmount(
                crop.getPrice() * qty
        );

        logger.info(
                "Creating order for farmerId={}",
                crop.getFarmerId()
        );

        orderClient.createOrder(order);
    }
}