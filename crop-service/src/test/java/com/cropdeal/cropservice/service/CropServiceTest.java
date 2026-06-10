package com.cropdeal.cropservice.service;

import com.cropdeal.cropservice.dto.FarmerResponseDto;
import com.cropdeal.cropservice.entity.Crop;
import com.cropdeal.cropservice.entity.Receipt;
import com.cropdeal.cropservice.entity.Subscription;
import com.cropdeal.cropservice.feign.FarmerClient;
import com.cropdeal.cropservice.repository.CropRepository;
import com.cropdeal.cropservice.repository.ReceiptRepository;
import com.cropdeal.cropservice.repository.SubscriptionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CropServiceTest {

    @Mock
    private CropRepository cropRepository;

    @Mock
    private ReceiptRepository receiptRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private FarmerClient farmerClient;

    @InjectMocks
    private CropService cropService;

    private Crop testCrop;

    @BeforeEach
    void setUp() {

        testCrop = new Crop();
        testCrop.setId(1);
        testCrop.setName("Tomato");
        testCrop.setPrice(20);
        testCrop.setQuantity(10);
        testCrop.setFarmerId(1);
    }

    @Test
    void testAddCropSuccess() {

        FarmerResponseDto farmer = new FarmerResponseDto();
        farmer.setId(1L);

        when(farmerClient.getFarmer(1L)).thenReturn(farmer);
        when(cropRepository.save(any())).thenReturn(testCrop);

        Crop result = cropService.addCrop(testCrop);

        assertNotNull(result);
        assertEquals("Tomato", result.getName());
    }

    @Test
    void testAddCropFarmerNotFound() {

        when(farmerClient.getFarmer(99L)).thenReturn(null);

        testCrop.setFarmerId(99);

        assertThrows(
                IllegalArgumentException.class,
                () -> cropService.addCrop(testCrop)
        );
    }

    @Test
    void testGetAllCrops() {

        when(cropRepository.findAll()).thenReturn(List.of(testCrop));

        List<Crop> result = cropService.getAllCrops();

        assertEquals(1, result.size());
    }

    @Test
    void testGenerateReceipt() {

        Receipt receipt = new Receipt();
        receipt.setQuantity(2);
        receipt.setPrice(50);

        when(receiptRepository.save(any())).thenReturn(receipt);

        Receipt result = cropService.generateReceipt(receipt);

        assertEquals(100, result.getTotalAmount());
    }

    @Test
    void testSubscribe() {

        Subscription subscription = new Subscription();

        when(subscriptionRepository.save(subscription))
                .thenReturn(subscription);

        Subscription result =
                cropService.subscribe(subscription);

        assertNotNull(result);
    }

    @Test
    void testGetCropsByFarmer() {

        when(cropRepository.findByFarmerId(1))
                .thenReturn(List.of(testCrop));

        List<Crop> result =
                cropService.getCropsByFarmer(1);

        assertEquals(1, result.size());
    }

    @Test
    void testGetAllReceipts() {

        when(receiptRepository.findAll())
                .thenReturn(List.of(new Receipt()));

        List<Receipt> result =
                cropService.getAllReceipts();

        assertEquals(1, result.size());
    }

    @Test
    void testGetCropById() {

        when(cropRepository.findById(1))
                .thenReturn(Optional.of(testCrop));

        Crop result =
                cropService.getCropById(1);

        assertEquals(1, result.getId());
    }

    @Test
    void testBuyCropSuccess() {

        when(cropRepository.findById(1))
                .thenReturn(Optional.of(testCrop));

        when(cropRepository.save(any()))
                .thenReturn(testCrop);

        Crop result =
                cropService.buyCrop(1, 5);

        assertEquals(5, result.getQuantity());
    }

    @Test
    void testBuyCropNotEnoughStock() {

        when(cropRepository.findById(1))
                .thenReturn(Optional.of(testCrop));

        assertThrows(
                IllegalStateException.class,
                () -> cropService.buyCrop(1, 50)
        );
    }
}