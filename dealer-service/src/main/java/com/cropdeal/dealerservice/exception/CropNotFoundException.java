package com.cropdeal.dealerservice.exception;

public class CropNotFoundException extends RuntimeException {

    public CropNotFoundException(String message) {
        super(message);
    }
}