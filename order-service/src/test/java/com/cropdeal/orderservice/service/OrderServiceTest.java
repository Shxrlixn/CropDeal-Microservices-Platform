package com.cropdeal.orderservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.cropdeal.orderservice.dto.InvoiceDTO;
import com.cropdeal.orderservice.dto.OrderDTO;
import com.cropdeal.orderservice.dto.PaymentDTO;
import com.cropdeal.orderservice.entity.Order;
import com.cropdeal.orderservice.entity.Payment;
import com.cropdeal.orderservice.exception.OrderNotFoundException;
import com.cropdeal.orderservice.exception.PaymentMismatchException;
import com.cropdeal.orderservice.repository.OrderRepository;
import com.cropdeal.orderservice.repository.PaymentRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private OrderService orderService;

    private Order order;

    @BeforeEach
    void setUp() {

        order = new Order();

        order.setId(1);
        order.setCropId(101);
        order.setFarmerId(201);
        order.setDealerId(301);
        order.setQuantity(10);
        order.setPrice(500.0);
        order.setTotalAmount(5000.0);
    }

    @Test
    void testCreateOrder() {

        OrderDTO orderDTO = new OrderDTO();

        orderDTO.setCropId(101);
        orderDTO.setFarmerId(201);
        orderDTO.setDealerId(301);
        orderDTO.setQuantity(10);
        orderDTO.setPrice(500.0);

        when(orderRepository.save(any(Order.class)))
                .thenReturn(order);

        OrderDTO result = orderService.createOrder(orderDTO);

        assertNotNull(result);
        assertEquals(5000.0, result.getTotalAmount());
    }

    @Test
    void testGenerateInvoiceSuccess() {

        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));

        InvoiceDTO invoice = orderService.generateInvoice(1);

        assertNotNull(invoice);
        assertEquals("Crop-101", invoice.getCropName());
        assertEquals(5000.0, invoice.getTotalAmount());
    }

    @Test
    void testGenerateInvoiceOrderNotFound() {

        when(orderRepository.findById(1))
                .thenReturn(Optional.empty());

        int orderId = 1;

        OrderNotFoundException exception = assertThrows(
                OrderNotFoundException.class,
                () -> orderService.generateInvoice(orderId)
        );

        assertEquals(
                "Order not found",
                exception.getMessage()
        );
    }

    @Test
    void testGetAllOrders() {

        when(orderRepository.findAll())
                .thenReturn(Arrays.asList(order));

        List<OrderDTO> orders = orderService.getAllOrders();

        assertEquals(1, orders.size());
    }

    @Test
    void testMakePaymentSuccess() {

        PaymentDTO paymentDTO = new PaymentDTO();

        paymentDTO.setOrderId(1);
        paymentDTO.setAmount(5000.0);

        Payment payment = new Payment();

        payment.setId(1);
        payment.setOrderId(1);
        payment.setAmount(5000.0);
        payment.setStatus("SUCCESS");

        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));

        when(paymentRepository.save(any(Payment.class)))
                .thenReturn(payment);

        PaymentDTO result = orderService.makePayment(paymentDTO);

        assertNotNull(result);
        assertEquals("SUCCESS", result.getStatus());
    }

    @Test
    void testMakePaymentOrderNotFound() {

        PaymentDTO paymentDTO = new PaymentDTO();

        paymentDTO.setOrderId(1);
        paymentDTO.setAmount(5000.0);

        when(orderRepository.findById(1))
                .thenReturn(Optional.empty());

        OrderNotFoundException exception = assertThrows(
                OrderNotFoundException.class,
                () -> orderService.makePayment(paymentDTO)
        );

        assertEquals(
                "Order not found",
                exception.getMessage()
        );
    }

    @Test
    void testMakePaymentMismatch() {

        PaymentDTO paymentDTO = new PaymentDTO();

        paymentDTO.setOrderId(1);
        paymentDTO.setAmount(1000.0);

        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));

        PaymentMismatchException exception = assertThrows(
                PaymentMismatchException.class,
                () -> orderService.makePayment(paymentDTO)
        );

        assertEquals(
                "Incorrect payment amount",
                exception.getMessage()
        );
    }
}