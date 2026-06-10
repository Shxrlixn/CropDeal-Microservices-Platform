package com.cropdeal.admin.usermanagement.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class ApiResponseTest {

    @Test
    void shouldCreateSuccessResponse() {

        String data = "User created successfully";

        ApiResponse<String> response =
                ApiResponse.success(
                        "Success",
                        data
                );

        assertThat(response)
                .isNotNull();

        assertThat(response.isSuccess())
                .isTrue();

        assertThat(response.getMessage())
                .isEqualTo("Success");

        assertThat(response.getData())
                .isEqualTo(data);

        assertThat(response.getTimestamp())
                .isNotNull();
    }

    @Test
    void shouldCreateErrorResponse() {

        ApiResponse<Object> response =
                ApiResponse.error(
                        "Something went wrong"
                );

        assertThat(response)
                .isNotNull();

        assertThat(response.isSuccess())
                .isFalse();

        assertThat(response.getMessage())
                .isEqualTo(
                        "Something went wrong"
                );

        assertThat(response.getData())
                .isNull();

        assertThat(response.getTimestamp())
                .isNotNull();
    }

    @Test
    void shouldCreateObjectUsingBuilder() {

        LocalDateTime now =
                LocalDateTime.now();

        ApiResponse<String> response =
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Builder Success")
                        .data("Test Data")
                        .timestamp(now)
                        .build();

        assertThat(response.isSuccess())
                .isTrue();

        assertThat(response.getMessage())
                .isEqualTo("Builder Success");

        assertThat(response.getData())
                .isEqualTo("Test Data");

        assertThat(response.getTimestamp())
                .isEqualTo(now);
    }

    @Test
    void shouldTestNoArgsConstructorAndSetters() {

        LocalDateTime now =
                LocalDateTime.now();

        ApiResponse<String> response =
                new ApiResponse<>();

        response.setSuccess(true);
        response.setMessage("Setter Test");
        response.setData("Sample Data");
        response.setTimestamp(now);

        assertThat(response.isSuccess())
                .isTrue();

        assertThat(response.getMessage())
                .isEqualTo("Setter Test");

        assertThat(response.getData())
                .isEqualTo("Sample Data");

        assertThat(response.getTimestamp())
                .isEqualTo(now);
    }

    @Test
    void shouldTestAllArgsConstructor() {

        LocalDateTime now =
                LocalDateTime.now();

        ApiResponse<String> response =
                new ApiResponse<>(
                        true,
                        "All Args",
                        "Data",
                        now
                );

        assertThat(response.isSuccess())
                .isTrue();

        assertThat(response.getMessage())
                .isEqualTo("All Args");

        assertThat(response.getData())
                .isEqualTo("Data");

        assertThat(response.getTimestamp())
                .isEqualTo(now);
    }
}