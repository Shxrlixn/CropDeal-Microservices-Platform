package com.cropdeal.orderservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cropdeal.orderservice.dto.InvoiceDTO;
import com.cropdeal.orderservice.dto.OrderDTO;
import com.cropdeal.orderservice.dto.PaymentDTO;
import com.cropdeal.orderservice.entity.Order;
import com.cropdeal.orderservice.entity.Payment;
import com.cropdeal.orderservice.exception.OrderNotFoundException;
import com.cropdeal.orderservice.exception.PaymentMismatchException;
import com.cropdeal.orderservice.repository.OrderRepository;
import com.cropdeal.orderservice.repository.PaymentRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public OrderService(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository) {

        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    /*
     * CREATE ORDER
     */
    public OrderDTO createOrder(OrderDTO dto) {

        Order order = new Order();

        order.setFarmerId(dto.getFarmerId());
        order.setDealerId(dto.getDealerId());
        order.setCropId(dto.getCropId());
        order.setQuantity(dto.getQuantity());
        order.setPrice(dto.getPrice());

        order.setTotalAmount(dto.getQuantity() * dto.getPrice());

        Order savedOrder = orderRepository.save(order);

        return new OrderDTO(savedOrder);
    }

    /*
     * GENERATE INVOICE
     */
    public InvoiceDTO generateInvoice(int orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new OrderNotFoundException("Order not found")
                );

        InvoiceDTO invoice = new InvoiceDTO();

        invoice.setCropName("Crop-" + order.getCropId());
        invoice.setFarmerName("Farmer-" + order.getFarmerId()); // placeholder
        invoice.setDealerName("Dealer-" + order.getDealerId());

        invoice.setQuantity(order.getQuantity());
        invoice.setPrice(order.getPrice());
        invoice.setTotalAmount(order.getTotalAmount());

        return invoice;
    }

    /*
     * GET ALL ORDERS
     */
    public List<OrderDTO> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(OrderDTO::new)
                .toList();
    }

    /*
     * MAKE PAYMENT
     */
    public PaymentDTO makePayment(PaymentDTO dto) {

        Order order = orderRepository
                .findById(dto.getOrderId())
                .orElseThrow(() ->
                        new OrderNotFoundException("Order not found")
                );

        if (!dto.getAmount().equals(order.getTotalAmount())) {
            throw new PaymentMismatchException("Incorrect payment amount");
        }

        Payment payment = new Payment();

        payment.setOrderId(dto.getOrderId());
        payment.setAmount(dto.getAmount());
        payment.setStatus("SUCCESS");

        Payment savedPayment = paymentRepository.save(payment);

        return new PaymentDTO(savedPayment);
    }
}