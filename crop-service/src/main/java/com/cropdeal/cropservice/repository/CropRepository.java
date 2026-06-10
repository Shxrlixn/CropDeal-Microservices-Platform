package com.cropdeal.cropservice.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cropdeal.cropservice.entity.Crop;






public interface CropRepository extends JpaRepository<Crop, Integer> {
	List<Crop> findByFarmerId(int farmerId);
}