package com.cropdeal.cropservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cropdeal.cropservice.dto.CropDto;
import com.cropdeal.cropservice.dto.ReceiptDto;
import com.cropdeal.cropservice.dto.SubscriptionDto;
import com.cropdeal.cropservice.entity.Crop;
import com.cropdeal.cropservice.entity.Receipt;
import com.cropdeal.cropservice.entity.Subscription;
import com.cropdeal.cropservice.service.CropService;

@RestController
@RequestMapping("/api/v1/crops")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    // ADD CROP
    @PostMapping
    public ResponseEntity<CropDto> addCrop(@RequestBody CropDto dto) {
        Crop saved = cropService.addCrop(mapToEntity(dto));
        return ResponseEntity.ok(mapToDto(saved));
    }

    // GET ALL CROPS
    @GetMapping
    public ResponseEntity<List<CropDto>> getAllCrops() {
        List<CropDto> crops = cropService.getAllCrops()
                .stream()
                .map(this::mapToDto)
                .toList();
        return ResponseEntity.ok(crops);
    }

    // GET BY FARMER
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<CropDto>> getCropsByFarmer(@PathVariable int farmerId) {
        List<CropDto> crops = cropService.getCropsByFarmer(farmerId)
                .stream()
                .map(this::mapToDto)
                .toList();
        return ResponseEntity.ok(crops);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<CropDto> getCropById(@PathVariable int id) {
        Crop crop = cropService.getCropById(id);
        if (crop == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapToDto(crop));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable int id) {
        cropService.deleteCrop(id);
        return ResponseEntity.noContent().build();
    }

    // GENERATE RECEIPT
    @PostMapping("/receipt")
    public ResponseEntity<ReceiptDto> generateReceipt(@RequestBody ReceiptDto dto) {
        Receipt saved = cropService.generateReceipt(mapToEntity(dto));
        return ResponseEntity.ok(mapToDto(saved));
    }

    // GET ALL RECEIPTS
    @GetMapping("/receipts")
    public ResponseEntity<List<ReceiptDto>> getAllReceipts() {
        List<ReceiptDto> list = cropService.getAllReceipts()
                .stream()
                .map(this::mapToDto)
                .toList();
        return ResponseEntity.ok(list);
    }

    // SUBSCRIBE
    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionDto> subscribe(@RequestBody SubscriptionDto dto) {
        Subscription saved = cropService.subscribe(mapToEntity(dto));
        return ResponseEntity.ok(mapToDto(saved));
    }

    // BUY CROP
    @PostMapping("/buy/{id}/{qty}")
    public ResponseEntity<CropDto> buyCrop(@PathVariable int id, @PathVariable int qty) {
        Crop crop = cropService.buyCrop(id, qty);
        return ResponseEntity.ok(mapToDto(crop));
    }

    // TEST API
    @GetMapping("/test")
    public String test() {
        return "CROP SERVICE WORKING";
    }

    // ---------------- MAPPERS ----------------

    private CropDto mapToDto(Crop crop) {
        CropDto dto = new CropDto();
        dto.setId(crop.getId());
        dto.setName(crop.getName());
        dto.setPrice(crop.getPrice());
        dto.setFarmerId(crop.getFarmerId());
        dto.setQuantity(crop.getQuantity());
        return dto;
    }

    private Crop mapToEntity(CropDto dto) {
        Crop crop = new Crop();
        crop.setId(dto.getId());
        crop.setName(dto.getName());
        crop.setPrice(dto.getPrice());
        crop.setFarmerId(dto.getFarmerId());
        crop.setQuantity(dto.getQuantity());
        return crop;
    }

    private ReceiptDto mapToDto(Receipt receipt) {
        ReceiptDto dto = new ReceiptDto();
        dto.setId(receipt.getId());
        dto.setQuantity(receipt.getQuantity());
        dto.setPrice(receipt.getPrice());
        dto.setTotalAmount(receipt.getTotalAmount());
        return dto;
    }

    private Receipt mapToEntity(ReceiptDto dto) {
        Receipt r = new Receipt();
        r.setId(dto.getId());
        r.setQuantity(dto.getQuantity());
        r.setPrice(dto.getPrice());
        return r;
    }

    private SubscriptionDto mapToDto(Subscription sub) {
        SubscriptionDto dto = new SubscriptionDto();
        dto.setId(sub.getId());
        dto.setDealerId(sub.getDealerId());
        dto.setCropType(sub.getCropType());
        return dto;
    }

    private Subscription mapToEntity(SubscriptionDto dto) {
        Subscription s = new Subscription();
        s.setDealerId(dto.getDealerId());
        s.setCropType(dto.getCropType());
        return s;
    }
}