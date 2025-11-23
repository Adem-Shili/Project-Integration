package org.backend.stockease.service.implementation;

import org.backend.stockease.entity.Shop;
import org.backend.stockease.entity.User;
import org.backend.stockease.repository.ShopRepository;
import org.backend.stockease.repository.UserRepository;
import org.backend.stockease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ShopRepository shopRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> updateUser(Long userId, User userDetails) {
        return userRepository.findById(userId)
                .map(user -> {
                    if (userDetails.getName() != null) {
                        user.setName(userDetails.getName());
                    }
                    if (userDetails.getEmail() != null) {
                        user.setEmail(userDetails.getEmail());
                    }
                    if (userDetails.getPhone() != null) {
                        user.setPhone(userDetails.getPhone());
                    }
                    if (userDetails.getAddress() != null) {
                        user.setAddress(userDetails.getAddress());
                    }
                    // Note: Password and role changes should be handled in a separate, more secure method.
                    return userRepository.save(user);
                });
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        // First, delete or deactivate all shops owned by this user
        List<Shop> shops = shopRepository.findAllByOwnerId(userId);
        for (Shop shop : shops) {
            // Deactivate shop and its products instead of deleting to preserve order history
            shop.setIsActive(false);
            shopRepository.save(shop);
        }
        
        // Delete the user (cascade will handle orders and cart)
        userRepository.deleteById(userId);
    }

    @Override
    public Optional<User> getCurrentUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username;
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
            // Try to parse as Long (userId) first, otherwise treat as email
            try {
                Long userId = Long.parseLong(username);
                return userRepository.findById(userId);
            } catch (NumberFormatException e) {
                return userRepository.findByEmail(username);
            }
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> updateCurrentUser(User userDetails) {
        return getCurrentUser().map(user -> {
            if (userDetails.getName() != null) {
                user.setName(userDetails.getName());
            }
            if (userDetails.getEmail() != null) {
                user.setEmail(userDetails.getEmail());
            }
            if (userDetails.getPhone() != null) {
                user.setPhone(userDetails.getPhone());
            }
            if (userDetails.getAddress() != null) {
                user.setAddress(userDetails.getAddress());
            }
            return userRepository.save(user);
        });
    }
}
