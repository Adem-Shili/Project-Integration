package org.backend.stockease.service;

import org.backend.stockease.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long userId);
    Optional<User> updateUser(Long userId, User userDetails);
    void deleteUser(Long userId);
    Optional<User> getCurrentUser();
    Optional<User> updateCurrentUser(User userDetails);
}
