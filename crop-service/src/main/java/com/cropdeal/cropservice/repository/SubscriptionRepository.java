package com.cropdeal.cropservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cropdeal.cropservice.entity.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription,Integer>{
	List<Subscription> findByCropType(String cropType);

}
