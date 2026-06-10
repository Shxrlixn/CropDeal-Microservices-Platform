package com.cropdeal.userservice.controller;

import com.cropdeal.userservice.dto.UserDTO;
import com.cropdeal.userservice.entity.User;
import com.cropdeal.userservice.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Health check
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("User Service Working!");
    }

    // ✅ Register (NO TOKEN REQUIRED)
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {

        User savedUser = userService.register(convertToEntity(userDTO));

        return ResponseEntity.ok(convertToDTO(savedUser));
    }

    // ✅ Get all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {

        List<UserDTO> users = userService.getAllUsers()
                .stream()
                .map(this::convertToDTO)
                .toList();

        return ResponseEntity.ok(users);
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable int id) {

        User user = userService.getUserById(id);

        return ResponseEntity.ok(convertToDTO(user));
    }

    // ✅ Get user by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(
            @PathVariable String email) {

        User user = userService.getUserByEmail(email);

        return ResponseEntity.ok(convertToDTO(user));
    }

    // -------- Mapping --------

    private UserDTO convertToDTO(User user) {

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress()
        );
    }

    private User convertToEntity(UserDTO dto) {

        User user = new User();

        user.setId(dto.getId());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        user.setName(
                dto.getName() != null ? dto.getName() : "NA"
        );

        user.setRole(
                dto.getRole() != null ? dto.getRole() : "USER"
        );

        user.setPhone(
                dto.getPhone() != null ? dto.getPhone() : "NA"
        );

        user.setAddress(
                dto.getAddress() != null ? dto.getAddress() : "NA"
        );

        return user;
    }
}