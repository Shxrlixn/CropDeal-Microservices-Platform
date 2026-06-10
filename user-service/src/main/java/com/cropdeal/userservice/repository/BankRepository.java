package com.cropdeal.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cropdeal.userservice.entity.BankDetails;

public interface BankRepository extends JpaRepository<BankDetails,Integer>{
	BankDetails findByUserId(int userId);
	

}
