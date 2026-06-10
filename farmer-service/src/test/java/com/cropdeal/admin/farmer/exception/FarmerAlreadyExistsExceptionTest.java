package com.cropdeal.admin.farmer.exception;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FarmerAlreadyExistsExceptionTest {

    @Test
    void shouldCreateExceptionWithMessage() {
        String message = "Farmer already exists";

        FarmerAlreadyExistsException exception =
                new FarmerAlreadyExistsException(message);

        assertThat(exception).isNotNull();
        assertThat(exception.getMessage()).isEqualTo(message);
    }

    @Test
    void shouldInheritFromRuntimeException() {
        FarmerAlreadyExistsException exception =
                new FarmerAlreadyExistsException("Test");

        assertThat(exception).isInstanceOf(RuntimeException.class);
    }
}