package com.cropdeal.dealerservice.service;

import com.cropdeal.dealerservice.dto.CropResponse;
import com.cropdeal.dealerservice.dto.OrderRequest;
import com.cropdeal.dealerservice.feign.CropClient;
import com.cropdeal.dealerservice.feign.OrderClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DealerServiceTest {

    @Mock
    private CropClient cropClient;

    @Mock
    private OrderClient orderClient;

    @InjectMocks
    private DealerService dealerService;

    private CropResponse cropResponse;

    @BeforeEach
    void setUp() {

        cropResponse = new CropResponse();

        cropResponse.setId(1);
        cropResponse.setFarmerId(101);
        cropResponse.setPrice(200.0);
        cropResponse.setQuantity(50);
        cropResponse.setName("Rice");
    }

    @Test
    void shouldReturnAllCrops() {

        List<CropResponse> crops =
                Collections.singletonList(cropResponse);

        when(cropClient.getAllCrops())
                .thenReturn(crops);

        List<CropResponse> result =
                dealerService.getAllCrops();

        assertThat(result)
                .isNotNull()
                .hasSize(1);

        CropResponse response = result.get(0);

        assertThat(response.getName())
                .isEqualTo("Rice");

        assertThat(response.getPrice())
                .isEqualTo(200.0);

        verify(cropClient)
                .getAllCrops();

        verifyNoMoreInteractions(cropClient);
    }

    @Test
    void shouldBuyCropAndCreateOrder() {

        when(cropClient.buyCrop(1, 5))
                .thenReturn(cropResponse);

        when(orderClient.createOrder(any(OrderRequest.class)))
                .thenReturn(null);

        dealerService.buyCrop(1, 5);

        ArgumentCaptor<OrderRequest> captor =
                ArgumentCaptor.forClass(OrderRequest.class);

        verify(orderClient)
                .createOrder(captor.capture());

        OrderRequest orderRequest =
                captor.getValue();

        assertThat(orderRequest.getCropId())
                .isEqualTo(1);

        assertThat(orderRequest.getFarmerId())
                .isEqualTo(101);

        assertThat(orderRequest.getDealerId())
                .isEqualTo(1);

        assertThat(orderRequest.getQuantity())
                .isEqualTo(5);

        assertThat(orderRequest.getPrice())
                .isEqualTo(200.0);

        assertThat(orderRequest.getTotalAmount())
                .isEqualTo(1000.0);

        verify(cropClient)
                .buyCrop(1, 5);

        verify(orderClient)
                .createOrder(any(OrderRequest.class));

        verifyNoMoreInteractions(cropClient, orderClient);
    }

    @Test
    void shouldThrowExceptionWhenCropIsNull() {

        when(cropClient.buyCrop(1, 5))
                .thenReturn(null);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> dealerService.buyCrop(1, 5)
                );

        assertThat(exception.getMessage())
                .isEqualTo(
                        "Crop not found or insufficient quantity"
                );

        verify(cropClient)
                .buyCrop(1, 5);

        verify(orderClient, never())
                .createOrder(any(OrderRequest.class));

        verifyNoMoreInteractions(cropClient, orderClient);
    }
}