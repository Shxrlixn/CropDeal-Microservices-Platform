package com.cropdeal.orderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cropdeal.orderservice.entity.Order;

public interface OrderRepository extends JpaRepository<Order,Integer>{

}
