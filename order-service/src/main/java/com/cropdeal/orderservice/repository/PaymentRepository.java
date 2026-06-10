package com.cropdeal.orderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cropdeal.orderservice.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment,Integer>{

}
