package com.cropdeal.orderservice.dto;

import com.cropdeal.orderservice.entity.Order;

public class OrderDTO {

    private Integer id;
    private Integer farmerId;
    private Integer dealerId;
    private Integer cropId;
    private Integer quantity;
    private Double price;
    private Double totalAmount;

    public OrderDTO() {
    }

    public OrderDTO(Order order) {
        this.id = order.getId();   // ✅ fixed here
        this.farmerId = order.getFarmerId();
        this.dealerId = order.getDealerId();
        this.cropId = order.getCropId();
        this.quantity = order.getQuantity();
        this.price = order.getPrice();
        this.totalAmount = order.getTotalAmount();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Integer farmerId) {
        this.farmerId = farmerId;
    }

    public Integer getDealerId() {
        return dealerId;
    }

    public void setDealerId(Integer dealerId) {
        this.dealerId = dealerId;
    }

    public Integer getCropId() {
        return cropId;
    }

    public void setCropId(Integer cropId) {
        this.cropId = cropId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}