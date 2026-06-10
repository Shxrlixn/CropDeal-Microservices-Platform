package com.cropdeal.admin.farmer.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.cropdeal.admin.farmer.dto.ApiResponse;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler =
            new GlobalExceptionHandler();

    @Test
    void testHandleNotFound() {

        FarmerNotFoundException exception =
                new FarmerNotFoundException("not found");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleNotFound(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND,
                     response.getStatusCode());
    }

    @Test
    void testHandleAlreadyExists() {

        FarmerAlreadyExistsException exception =
                new FarmerAlreadyExistsException("exists");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleAlreadyExists(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.CONFLICT,
                     response.getStatusCode());
    }

    @Test
    void testHandleIllegalArgument() {

        IllegalArgumentException exception =
                new IllegalArgumentException("bad request");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleIllegalArgument(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST,
                     response.getStatusCode());
    }

    @Test
    void testHandleGeneralException() {

        Exception exception =
                new Exception("unexpected error");

        ResponseEntity<ApiResponse<Void>> response =
                handler.handleGeneral(exception);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR,
                     response.getStatusCode());
    }
}