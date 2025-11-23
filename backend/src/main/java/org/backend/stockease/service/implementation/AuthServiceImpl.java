package org.backend.stockease.service.implementation;

import org.backend.stockease.dto.AuthResponse;
import org.backend.stockease.dto.LoginRequest;
import org.backend.stockease.dto.RegisterRequest;
import org.backend.stockease.entity.Cart;
import org.backend.stockease.entity.User;
import org.backend.stockease.entity.enums.Role;
import org.backend.stockease.repository.CartRepository;
import org.backend.stockease.repository.UserRepository;
import org.backend.stockease.security.JwtProvider;
import org.backend.stockease.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());

        // Validate and set the role
        Role userRole = Role.CLIENT; // Default role
        String roleStr = request.getRole();
        if ("SELLER".equalsIgnoreCase(roleStr) || "supplier".equalsIgnoreCase(roleStr)) {
            userRole = Role.SELLER;
        } else if ("ADMIN".equalsIgnoreCase(roleStr) || "admin".equalsIgnoreCase(roleStr)) {
            userRole = Role.ADMIN;
        }
        user.setRole(userRole);
        
        user = userRepository.save(user);
        
        // Create cart for new user
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);
        
        // Generate token for the newly registered user using userId as subject
        String token = jwtProvider.generateTokenFromUserId(user.getId(), user.getEmail(), user.getRole().name());
        
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token, "Registration successful");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token, "Login successful");
    }
}

