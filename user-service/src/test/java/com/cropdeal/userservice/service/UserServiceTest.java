package com.cropdeal.userservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.cropdeal.userservice.entity.User;
import com.cropdeal.userservice.exception.UserAlreadyExistsException;
import com.cropdeal.userservice.exception.UserNotFoundException;
import com.cropdeal.userservice.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setId(1);
        user.setName("John");
        user.setEmail("john@example.com");
        user.setRole("USER");
        user.setPhone("9876543210");
        user.setAddress("Bangalore");
    }

    @Test
    void testRegisterSuccess() {

        when(userRepository.existsByEmail(user.getEmail()))
                .thenReturn(false);

        when(userRepository.save(user))
                .thenReturn(user);

        User savedUser = userService.register(user);

        assertNotNull(savedUser);
        assertEquals("John", savedUser.getName());
    }

    @Test
    void testRegisterUserAlreadyExists() {

        when(userRepository.existsByEmail(user.getEmail()))
                .thenReturn(true);

        UserAlreadyExistsException exception = assertThrows(
                UserAlreadyExistsException.class,
                () -> userService.register(user)
        );

        assertEquals(
                "User already exists",
                exception.getMessage()
        );
    }

    @Test
    void testGetAllUsers() {

        List<User> users = Arrays.asList(user);

        when(userRepository.findAll())
                .thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertEquals(1, result.size());
    }

    @Test
    void testGetUserByIdSuccess() {

        when(userRepository.findById(1))
                .thenReturn(Optional.of(user));

        User foundUser = userService.getUserById(1);

        assertEquals("John", foundUser.getName());
    }

    @Test
    void testGetUserByIdNotFound() {

        when(userRepository.findById(1))
                .thenReturn(Optional.empty());

        int userId = 1;

        UserNotFoundException exception = assertThrows(
                UserNotFoundException.class,
                () -> userService.getUserById(userId)
        );

        assertEquals(
                "User not found",
                exception.getMessage()
        );
    }

    @Test
    void testGetUserByEmailSuccess() {

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));

        User foundUser =
                userService.getUserByEmail(user.getEmail());

        assertEquals(
                user.getEmail(),
                foundUser.getEmail()
        );
    }

    @Test
    void testGetUserByEmailNotFound() {

        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.empty());

        String email = user.getEmail();

        UserNotFoundException exception = assertThrows(
                UserNotFoundException.class,
                () -> userService.getUserByEmail(email)
        );

        assertEquals(
                "User not found",
                exception.getMessage()
        );
    }

    @Test
    void testUpdateUser() {

        User updatedUser = new User();

        updatedUser.setName("Updated Name");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setRole("ADMIN");
        updatedUser.setPhone("9999999999");
        updatedUser.setAddress("Mumbai");

        when(userRepository.findById(1))
                .thenReturn(Optional.of(user));

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        User result = userService.updateUser(1, updatedUser);

        assertNotNull(result);
    }
}