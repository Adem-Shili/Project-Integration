package org.backend.stockease.service;

import org.backend.stockease.entity.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(Long userId, String address);
    List<Order> getUserOrders(Long userId);
    Optional<Order> getOrderByNumber(String orderNumber);
    Optional<Order> getOrderById(Long orderId);
}

