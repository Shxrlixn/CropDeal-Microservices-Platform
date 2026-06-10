package com.cropdeal.admin.farmer.repository;

import com.cropdeal.admin.farmer.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminFarmerRepository extends JpaRepository<Farmer, Long> {
    List<Farmer> findByStatus(Farmer.FarmerStatus status);
    Optional<Farmer> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByAadharNumber(String aadharNumber);
}