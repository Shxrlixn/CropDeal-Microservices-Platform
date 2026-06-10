package com.cropdeal.cropservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cropdeal.cropservice.entity.Receipt;

public interface ReceiptRepository extends JpaRepository<Receipt, Integer> {

}
