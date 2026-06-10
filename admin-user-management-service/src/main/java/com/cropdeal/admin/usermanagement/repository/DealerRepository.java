package com.cropdeal.admin.usermanagement.repository;

import com.cropdeal.admin.usermanagement.entity.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealerRepository extends JpaRepository<Dealer, Long> {

    boolean existsByEmail(String email);
}