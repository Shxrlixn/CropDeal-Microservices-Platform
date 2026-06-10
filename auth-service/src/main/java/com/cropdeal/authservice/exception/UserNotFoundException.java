package com.cropdeal.authservice.exception;

public class UserNotFoundException
        extends RuntimeException {

    public UserNotFoundException(
            String message
    ) {

        super(message);
    }
}