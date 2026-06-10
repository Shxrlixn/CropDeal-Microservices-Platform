package com.cropdeal.admin.farmer.mapper;

import com.cropdeal.admin.farmer.dto.FarmerRequestDto;
import com.cropdeal.admin.farmer.dto.FarmerResponseDto;
import com.cropdeal.admin.farmer.entity.Farmer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AdminFarmerMapperTest {

    private FarmerMapper mapper;


    @BeforeEach
    void setup() {
        mapper = new FarmerMapper();
    }


    @Test
    void shouldUpdateAllFieldsWhenDtoContainsValues() {

        Farmer farmer = new Farmer();

        FarmerRequestDto dto = new FarmerRequestDto();
        dto.setFirstName("Ravi");
        dto.setLastName("Kumar");
        dto.setEmail("ravi@gmail.com");
        dto.setPhone("9999999999");
        dto.setAddress("Bangalore");
        dto.setState("Karnataka");
        dto.setDistrict("Bangalore Urban");
        dto.setBankAccountNumber("1234567890");
        dto.setBankName("SBI");
        dto.setIfscCode("SBIN0001234");
        dto.setStatus(Farmer.FarmerStatus.ACTIVE);

        mapper.updateEntityFromDto(dto, farmer);

        assertAll(
                () -> assertEquals("Ravi", farmer.getFirstName()),
                () -> assertEquals("Kumar", farmer.getLastName()),
                () -> assertEquals("ravi@gmail.com", farmer.getEmail()),
                () -> assertEquals("9999999999", farmer.getPhone()),
                () -> assertEquals("Bangalore", farmer.getAddress()),
                () -> assertEquals("Karnataka", farmer.getState()),
                () -> assertEquals("Bangalore Urban", farmer.getDistrict()),
                () -> assertEquals("1234567890", farmer.getBankAccountNumber()),
                () -> assertEquals("SBI", farmer.getBankName()),
                () -> assertEquals("SBIN0001234", farmer.getIfscCode()),
                () -> assertEquals(Farmer.FarmerStatus.ACTIVE, farmer.getStatus())
        );
    }


    @Test
    void shouldIgnoreNullFieldsDuringUpdate() {

        Farmer farmer = new Farmer();
        farmer.setFirstName("OldName");

        FarmerRequestDto dto = new FarmerRequestDto();

        mapper.updateEntityFromDto(dto, farmer);

        assertEquals("OldName", farmer.getFirstName());
    }


    @Test
    void shouldConvertDtoToEntityWithProvidedStatus() {

        FarmerRequestDto dto = new FarmerRequestDto();
        dto.setFirstName("Ravi");
        dto.setStatus(Farmer.FarmerStatus.INACTIVE);

        Farmer farmer = mapper.toEntity(dto);

        assertNotNull(farmer);
        assertEquals("Ravi", farmer.getFirstName());
        assertEquals(Farmer.FarmerStatus.INACTIVE, farmer.getStatus());
    }


    @Test
    void shouldAssignDefaultActiveStatusWhenStatusMissing() {

        FarmerRequestDto dto = new FarmerRequestDto();
        dto.setFirstName("Asha");

        Farmer farmer = mapper.toEntity(dto);

        assertNotNull(farmer);
        assertEquals(Farmer.FarmerStatus.ACTIVE, farmer.getStatus());
    }


    @Test
    void shouldConvertEntityToResponseDtoSuccessfully() {

        Farmer farmer = new Farmer();
        farmer.setId(1L);
        farmer.setFirstName("Ravi");
        farmer.setStatus(Farmer.FarmerStatus.ACTIVE);

        FarmerResponseDto dto = mapper.toResponseDto(farmer);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Ravi", dto.getFirstName());
        assertEquals(Farmer.FarmerStatus.ACTIVE, dto.getStatus());
    }
}