package org.backend.stockease.service;

import org.backend.stockease.entity.CartItem;

import java.util.List;

public interface CartService {
    List<CartItem> getCartItems(Long userId);
    CartItem addToCart(Long userId, Long productId, Integer quantity);
    void removeFromCart(Long userId, Long cartItemId);
    CartItem updateCartItem(Long userId, Long cartItemId, Integer quantity);
    void clearCart(Long userId);
}

