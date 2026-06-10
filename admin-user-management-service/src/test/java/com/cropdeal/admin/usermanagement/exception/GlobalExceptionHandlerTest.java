package com.cropdeal.admin.usermanagement.exception;

import com.cropdeal.admin.usermanagement.dto.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler globalExceptionHandler;

    @BeforeEach
    void setUp() {

        globalExceptionHandler =
                new GlobalExceptionHandler();
    }

    @Test
    void shouldHandleResourceNotFoundException() {

        ResourceNotFoundException exception =
                new ResourceNotFoundException(
                        "User not found"
                );

        ResponseEntity<ApiResponse<Void>> response =
                globalExceptionHandler
                        .handleNotFound(exception);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);

        assertThat(response.getBody())
                .isNotNull();

        assertThat(response.getBody().getMessage())
                .isEqualTo("User not found");
    }

    @Test
    void shouldHandleResourceAlreadyExistsException() {

        ResourceAlreadyExistsException exception =
                new ResourceAlreadyExistsException(
                        "User already exists"
                );

        ResponseEntity<ApiResponse<Void>> response =
                globalExceptionHandler
                        .handleAlreadyExists(exception);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.CONFLICT);

        assertThat(response.getBody())
                .isNotNull();

        assertThat(response.getBody().getMessage())
                .isEqualTo("User already exists");
    }

    @Test
    void shouldHandleIllegalArgumentException() {

        IllegalArgumentException exception =
                new IllegalArgumentException(
                        "Invalid input"
                );

        ResponseEntity<ApiResponse<Void>> response =
                globalExceptionHandler
                        .handleIllegalArgument(exception);

        assertThat(response.getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);

        assertThat(response.getBody())
                .isNotNull();

        assertThat(response.getBody().getMessage())
                .isEqualTo("Invalid input");
    }

    @Test
    void shouldHandleGeneralException() {

        Exception exception =
                new Exception("Something went wrong");

        ResponseEntity<ApiResponse<Void>> response =
                globalExceptionHandler
                        .handleGeneral(exception);

        assertThat(response.getStatusCode())
                .isEqualTo(
                        HttpStatus.INTERNAL_SERVER_ERROR
                );

        assertThat(response.getBody())
                .isNotNull();

        assertThat(response.getBody().getMessage())
                .contains("Exception")
                .contains("Something went wrong");
    }
}