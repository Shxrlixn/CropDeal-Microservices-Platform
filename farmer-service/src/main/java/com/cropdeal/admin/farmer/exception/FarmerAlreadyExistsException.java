package com.cropdeal.admin.farmer.exception;

public class FarmerAlreadyExistsException extends RuntimeException {
    public FarmerAlreadyExistsException(String message) {
        super(message);
    }
}