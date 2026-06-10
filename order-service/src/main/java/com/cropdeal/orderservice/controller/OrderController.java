package com.cropdeal.orderservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.cropdeal.orderservice.dto.InvoiceDTO;
import com.cropdeal.orderservice.dto.OrderDTO;
import com.cropdeal.orderservice.dto.PaymentDTO;
import com.cropdeal.orderservice.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderDTO createOrder(@RequestBody OrderDTO order) {
        return orderService.createOrder(order);
    }

    @GetMapping("/{orderId}/invoice")
    public InvoiceDTO getInvoice(@PathVariable int orderId) {
        return orderService.generateInvoice(orderId);
    }

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping("/payment")
    public PaymentDTO makePayment(@RequestBody PaymentDTO payment) {
        return orderService.makePayment(payment);
    }
}