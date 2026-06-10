package com.cropdeal.admin.usermanagement.exception;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ResourceNotFoundExceptionTest {

    @Test
    void shouldCreateExceptionWithMessage() {

        ResourceNotFoundException exception =
                new ResourceNotFoundException(
                        "User not found"
                );

        assertThat(exception)
                .isNotNull();

        assertThat(exception.getMessage())
                .isEqualTo("User not found");
    }
}