package com.cropdeal.admin.usermanagement.service;

import com.cropdeal.admin.usermanagement.dto.DealerRequestDto;
import com.cropdeal.admin.usermanagement.dto.DealerResponseDto;

import java.util.List;

public interface DealerManagementService {

    DealerResponseDto createDealer(DealerRequestDto dto);

    List<DealerResponseDto> getAllDealers();

    DealerResponseDto getDealer(Long id);

    DealerResponseDto updateDealer(Long id, DealerRequestDto dto);
}