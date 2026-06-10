package com.cropdeal.cropservice.service;

import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.cropdeal.cropservice.dto.FarmerResponseDto;
import com.cropdeal.cropservice.entity.Crop;
import com.cropdeal.cropservice.entity.Receipt;
import com.cropdeal.cropservice.entity.Subscription;
import com.cropdeal.cropservice.feign.FarmerClient;
import com.cropdeal.cropservice.repository.CropRepository;
import com.cropdeal.cropservice.repository.ReceiptRepository;
import com.cropdeal.cropservice.repository.SubscriptionRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CropService {

    private final CropRepository cropRepository;
    private final ReceiptRepository receiptRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final FarmerClient farmerClient;

    public CropService(
            CropRepository cropRepository,
            ReceiptRepository receiptRepository,
            SubscriptionRepository subscriptionRepository,
            FarmerClient farmerClient
    ) {
        this.cropRepository = cropRepository;
        this.receiptRepository = receiptRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.farmerClient = farmerClient;
    }

    public Crop addCrop(Crop crop) {

        log.info("Adding crop for farmerId={}", crop.getFarmerId());

        FarmerResponseDto farmer =
                farmerClient.getFarmer(Long.valueOf(crop.getFarmerId()));

        if (farmer == null) {
            throw new IllegalArgumentException("Farmer not found");
        }

        return cropRepository.save(crop);
    }

    public List<Crop> getAllCrops() {

        log.info("Fetching all crops");

        return cropRepository.findAll();
    }
    
    public void deleteCrop(int id) {

        log.info("Deleting crop with id={}", id);

        cropRepository.deleteById(id);
    }

    public Receipt generateReceipt(Receipt receipt) {

        log.info("Generating receipt");

        receipt.setTotalAmount(
                receipt.getQuantity() * receipt.getPrice()
        );

        return receiptRepository.save(receipt);
    }

    public List<Crop> getCropsByFarmer(int farmerId) {

        log.info("Fetching crops for farmerId={}", farmerId);

        return cropRepository.findByFarmerId(farmerId);
    }

    public List<Receipt> getAllReceipts() {

        log.info("Fetching all receipts");

        return receiptRepository.findAll();
    }

    public Subscription subscribe(Subscription subscription) {

        log.info("Adding new subscription");

        return subscriptionRepository.save(subscription);
    }

    public Crop getCropById(int id) {

        log.info("Fetching crop by id={}", id);

        return cropRepository
                .findById(id)
                .orElse(null);
    }

    @Async
    public void saveCropAsync(Crop crop) {

        log.info("Saving crop asynchronously: {}", crop.getName());

        cropRepository.save(crop);
    }

    public FarmerResponseDto getFarmerDetails(int id) {

        return farmerClient.getFarmer(Long.valueOf(id));
    }

    public Crop buyCrop(int cropId, int quantity) {

        Crop crop = cropRepository
                .findById(cropId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Crop not found"));

        if (crop.getQuantity() < quantity) {

            throw new IllegalStateException("Not enough stock");
        }

        crop.setQuantity(crop.getQuantity() - quantity);

        return cropRepository.save(crop);
    }
}