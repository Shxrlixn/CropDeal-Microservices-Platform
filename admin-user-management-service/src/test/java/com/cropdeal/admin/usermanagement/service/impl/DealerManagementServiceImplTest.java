package com.cropdeal.admin.usermanagement.service.impl;

import com.cropdeal.admin.usermanagement.dto.DealerRequestDto;
import com.cropdeal.admin.usermanagement.dto.DealerResponseDto;
import com.cropdeal.admin.usermanagement.entity.Dealer;
import com.cropdeal.admin.usermanagement.exception.ResourceNotFoundException;
import com.cropdeal.admin.usermanagement.repository.DealerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DealerManagementServiceImplTest {

    @Mock
    private DealerRepository dealerRepository;

    @InjectMocks
    private DealerManagementServiceImpl dealerService;

    private Dealer dealer;
    private DealerRequestDto requestDto;

    @BeforeEach
    void setUp() {

        requestDto = DealerRequestDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@gmail.com")
                .phone("9876543210")
                .address("Bangalore")
                .state("Karnataka")
                .district("Bangalore Urban")
                .businessName("JD Traders")
                .gstNumber("GST123")
                .bankAccountNumber("123456789")
                .bankName("SBI")
                .ifscCode("SBIN000123")
                .build();

        dealer = Dealer.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@gmail.com")
                .phone("9876543210")
                .address("Bangalore")
                .state("Karnataka")
                .district("Bangalore Urban")
                .businessName("JD Traders")
                .gstNumber("GST123")
                .bankAccountNumber("123456789")
                .bankName("SBI")
                .ifscCode("SBIN000123")
                .status("ACTIVE")
                .totalPurchaseAmount(0.0)
                .totalCropsPurchased(0)
                .registeredAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void shouldCreateDealer() {

        when(dealerRepository.save(any(Dealer.class)))
                .thenReturn(dealer);

        DealerResponseDto response =
                dealerService.createDealer(requestDto);

        assertThat(response)
                .isNotNull();

        assertThat(response.getFirstName())
                .isEqualTo("John");

        assertThat(response.getBusinessName())
                .isEqualTo("JD Traders");

        assertThat(response.getStatus())
                .isEqualTo("ACTIVE");

        verify(dealerRepository)
                .save(any(Dealer.class));

        verifyNoMoreInteractions(dealerRepository);
    }

    @Test
    void shouldReturnAllDealers() {

        when(dealerRepository.findAll())
                .thenReturn(Collections.singletonList(dealer));

        List<DealerResponseDto> response =
                dealerService.getAllDealers();

        assertThat(response)
                .isNotNull()
                .hasSize(1);

        assertThat(response.get(0).getEmail())
                .isEqualTo("john@gmail.com");

        verify(dealerRepository)
                .findAll();

        verifyNoMoreInteractions(dealerRepository);
    }

    @Test
    void shouldReturnDealerById() {

        when(dealerRepository.findById(1L))
                .thenReturn(Optional.of(dealer));

        DealerResponseDto response =
                dealerService.getDealer(1L);

        assertThat(response)
                .isNotNull();

        assertThat(response.getId())
                .isEqualTo(1L);

        assertThat(response.getFirstName())
                .isEqualTo("John");

        verify(dealerRepository)
                .findById(1L);

        verifyNoMoreInteractions(dealerRepository);
    }

    @Test
    void shouldThrowExceptionWhenDealerNotFound() {

        when(dealerRepository.findById(1L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> dealerService.getDealer(1L)
                );

        assertThat(exception.getMessage())
                .isEqualTo("Dealer not found");

        verify(dealerRepository)
                .findById(1L);

        verifyNoMoreInteractions(dealerRepository);
    }

    @Test
    void shouldUpdateDealer() {

        when(dealerRepository.findById(1L))
                .thenReturn(Optional.of(dealer));

        when(dealerRepository.save(any(Dealer.class)))
                .thenReturn(dealer);

        DealerResponseDto response =
                dealerService.updateDealer(1L, requestDto);

        assertThat(response)
                .isNotNull();

        assertThat(response.getFirstName())
                .isEqualTo("John");

        assertThat(response.getBusinessName())
                .isEqualTo("JD Traders");

        verify(dealerRepository)
                .findById(1L);

        verify(dealerRepository)
                .save(any(Dealer.class));

        verifyNoMoreInteractions(dealerRepository);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingMissingDealer() {

        when(dealerRepository.findById(1L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> dealerService.updateDealer(
                                1L,
                                requestDto
                        )
                );

        assertThat(exception.getMessage())
                .isEqualTo("Dealer not found");

        verify(dealerRepository)
                .findById(1L);

        verifyNoMoreInteractions(dealerRepository);
    }
}