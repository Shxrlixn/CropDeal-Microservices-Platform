package com.cropdeal.userservice.service;

import com.cropdeal.userservice.entity.User;
import com.cropdeal.userservice.exception.UserAlreadyExistsException;
import com.cropdeal.userservice.exception.UserNotFoundException;
import com.cropdeal.userservice.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register user
    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {

            throw new UserAlreadyExistsException(
                    "User already exists"
            );
        }

        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // Get by ID
    public User getUserById(int id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        )
                );
    }

    // Get by email
    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        )
                );
    }

    // Update
    public User updateUser(int id, User updatedUser) {

        User existing = getUserById(id);

        existing.setName(updatedUser.getName());
        existing.setEmail(updatedUser.getEmail());
        existing.setRole(updatedUser.getRole());
        existing.setPhone(updatedUser.getPhone());
        existing.setAddress(updatedUser.getAddress());

        return userRepository.save(existing);
    }
}