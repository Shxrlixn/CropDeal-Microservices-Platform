package com.cropdeal.authservice.service;

import org.springframework.stereotype.Service;

import com.cropdeal.authservice.dto.LoginResponse;
import com.cropdeal.authservice.exception.InvalidPasswordException;
import com.cropdeal.authservice.exception.UserNotFoundException;
import com.cropdeal.authservice.model.User;
import com.cropdeal.authservice.repository.UserRepository;
import com.cropdeal.authservice.util.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            JwtUtil jwtUtil
    ) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(
            String email,
            String password
    ) {

        // FIND USER
        User user =
                userRepository.findByEmail(email);

        // USER NOT FOUND
        if (user == null) {

            throw new UserNotFoundException(
                    "User not found with email: "
                            + email
            );
        }

        // INVALID PASSWORD
        if (!user.getPassword().equals(password)) {

            throw new InvalidPasswordException(
                    "Invalid password"
            );
        }

        // GENERATE JWT
        String token =
                jwtUtil.generateToken(
                        user.getEmail(),
                        user.getRole()
                );

        // RETURN TOKEN + ROLE
        return new LoginResponse(
                token,
                user.getRole()
        );
    }
}