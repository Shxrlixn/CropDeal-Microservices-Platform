package com.cropdeal.orderservice.exception;

public class PaymentMismatchException extends RuntimeException {

    public PaymentMismatchException(String message) {
        super(message);
    }
}