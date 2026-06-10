package com.cropdeal.admin.farmer.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class FarmerTest {

    // ✅ Builder + getters
    @Test
    void shouldBuildFarmerCorrectly() {

        LocalDateTime now = LocalDateTime.now();

        Farmer farmer = Farmer.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@gmail.com")
                .phone("9999999999")
                .address("Test Address")
                .state("KA")
                .district("Bangalore")
                .aadharNumber("123412341234")
                .bankAccountNumber("123456789")
                .bankName("SBI")
                .ifscCode("SBIN000123")
                .status(Farmer.FarmerStatus.ACTIVE)
                .rating(4.5)
                .totalCropsSold(10)
                .registeredAt(now)
                .updatedAt(now)
                .build();

        assertThat(farmer.getId()).isEqualTo(1L);
        assertThat(farmer.getFirstName()).isEqualTo("John");
        assertThat(farmer.getEmail()).isEqualTo("john@gmail.com");
        assertThat(farmer.getStatus()).isEqualTo(Farmer.FarmerStatus.ACTIVE);
        assertThat(farmer.getTotalCropsSold()).isEqualTo(10);
    }

    // ✅ PrePersist sets defaults
    @Test
    void shouldSetDefaultsOnPrePersist() {

        Farmer farmer = new Farmer();
        farmer.setEmail("test@gmail.com");

        farmer.prePersist();

        assertThat(farmer.getRegisteredAt()).isNotNull();
        assertThat(farmer.getUpdatedAt()).isNotNull();
        assertThat(farmer.getStatus()).isEqualTo(Farmer.FarmerStatus.ACTIVE);
        assertThat(farmer.getTotalCropsSold()).isZero(); // ✅ Sonar fix
    }

    // ✅ PrePersist should NOT override existing values
    @Test
    void shouldNotOverrideExistingValuesOnPrePersist() {

        Farmer farmer = new Farmer();
        farmer.setEmail("test@gmail.com");
        farmer.setStatus(Farmer.FarmerStatus.SUSPENDED);
        farmer.setTotalCropsSold(50);

        farmer.prePersist();

        assertThat(farmer.getStatus()).isEqualTo(Farmer.FarmerStatus.SUSPENDED);
        assertThat(farmer.getTotalCropsSold()).isEqualTo(50);
    }

    // ✅ PreUpdate updates timestamp
    @Test
    void shouldUpdateTimestampOnPreUpdate() {

        Farmer farmer = new Farmer();
        LocalDateTime before = LocalDateTime.now().minusSeconds(1);

        farmer.setUpdatedAt(before);
        farmer.preUpdate();

        assertThat(farmer.getUpdatedAt()).isAfter(before);
    }

    // ✅ Setter/Getter test (Lombok coverage)
    @Test
    void shouldSetAndGetValues() {

        Farmer farmer = new Farmer();

        farmer.setFirstName("Alice");
        farmer.setLastName("Smith");
        farmer.setEmail("alice@gmail.com");
        farmer.setPhone("8888888888");
        farmer.setStatus(Farmer.FarmerStatus.INACTIVE);

        assertThat(farmer.getFirstName()).isEqualTo("Alice");
        assertThat(farmer.getLastName()).isEqualTo("Smith");
        assertThat(farmer.getEmail()).isEqualTo("alice@gmail.com");
        assertThat(farmer.getStatus()).isEqualTo(Farmer.FarmerStatus.INACTIVE);
    }

    // ✅ Enum coverage
    @Test
    void shouldContainAllEnumValues() {

        Farmer.FarmerStatus[] statuses = Farmer.FarmerStatus.values();

        assertThat(statuses).containsExactlyInAnyOrder(
                Farmer.FarmerStatus.ACTIVE,
                Farmer.FarmerStatus.INACTIVE,
                Farmer.FarmerStatus.SUSPENDED
        );
    }
}