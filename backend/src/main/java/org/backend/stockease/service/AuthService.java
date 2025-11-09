package org.backend.stockease.service;

import org.backend.stockease.dto.AuthResponse;
import org.backend.stockease.dto.LoginRequest;
import org.backend.stockease.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}

