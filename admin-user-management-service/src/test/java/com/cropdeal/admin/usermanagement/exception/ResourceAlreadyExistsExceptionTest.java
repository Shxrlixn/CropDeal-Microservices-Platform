package com.cropdeal.admin.usermanagement.exception;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ResourceAlreadyExistsExceptionTest {

    @Test
    void shouldCreateExceptionWithMessage() {

        ResourceAlreadyExistsException exception =
                new ResourceAlreadyExistsException(
                        "User already exists"
                );

        assertThat(exception)
                .isNotNull();

        assertThat(exception.getMessage())
                .isEqualTo("User already exists");
    }
}