package com.cropdeal.cropservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private double price;

    @Column(name = "farmer_id", nullable = false)
    private int farmerId;

    private int quantity;
}