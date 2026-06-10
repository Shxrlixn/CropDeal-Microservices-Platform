package com.cropdeal.authservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cropdeal.authservice.dto.LoginRequest;
import com.cropdeal.authservice.dto.LoginResponse;
import com.cropdeal.authservice.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest req
    ) {

        LoginResponse response =
                service.login(
                        req.getEmail(),
                        req.getPassword()
                );

        return ResponseEntity.ok(response);
    }
}