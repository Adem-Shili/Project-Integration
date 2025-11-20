package org.backend.stockease.service.implementation;

import org.backend.stockease.dto.AuthResponse;
import org.backend.stockease.dto.LoginRequest;
import org.backend.stockease.dto.RegisterRequest;
import org.backend.stockease.entity.Cart;
import org.backend.stockease.entity.User;
import org.backend.stockease.repository.CartRepository;
import org.backend.stockease.repository.UserRepository;
import org.backend.stockease.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CartRepository cartRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, hash the password
        user.setPhone(request.getPhone());
        user = userRepository.save(user);
        
        // Create cart for new user
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);
        
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), "Registration successful");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), "Login successful");
    }
}

