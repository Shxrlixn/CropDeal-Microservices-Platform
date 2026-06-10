package com.cropdeal.admin.farmer.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class ApiResponseTest {

    // ✅ Test builder + getters
    @Test
    void shouldBuildApiResponseCorrectly() {
        LocalDateTime now = LocalDateTime.now();

        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(true)
                .message("Success message")
                .data("Sample Data")
                .timestamp(now)
                .build();

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getMessage()).isEqualTo("Success message");
        assertThat(response.getData()).isEqualTo("Sample Data");
        assertThat(response.getTimestamp()).isEqualTo(now);
    }

    // ✅ Test success() static method
    @Test
    void shouldCreateSuccessResponse() {
        ApiResponse<String> response =
                ApiResponse.success("Operation successful", "Data");

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getMessage()).isEqualTo("Operation successful");
        assertThat(response.getData()).isEqualTo("Data");
        assertThat(response.getTimestamp()).isNotNull();
    }

    // ✅ Test error() static method
    @Test
    void shouldCreateErrorResponse() {
        ApiResponse<Object> response =
                ApiResponse.error("Something went wrong");

        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getMessage()).isEqualTo("Something went wrong");
        assertThat(response.getData()).isNull();
        assertThat(response.getTimestamp()).isNotNull();
    }

    // ✅ Test no-args constructor + setters
    @Test
    void shouldSetValuesUsingSetters() {
        ApiResponse<Integer> response = new ApiResponse<>();

        response.setSuccess(true);
        response.setMessage("Test");
        response.setData(123);
        response.setTimestamp(LocalDateTime.now());

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getMessage()).isEqualTo("Test");
        assertThat(response.getData()).isEqualTo(123);
        assertThat(response.getTimestamp()).isNotNull();
    }

    // ✅ Test all-args constructor
    @Test
    void shouldCreateUsingAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();

        ApiResponse<String> response =
                new ApiResponse<>(true, "All args", "Data", now);

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getMessage()).isEqualTo("All args");
        assertThat(response.getData()).isEqualTo("Data");
        assertThat(response.getTimestamp()).isEqualTo(now);
    }
}