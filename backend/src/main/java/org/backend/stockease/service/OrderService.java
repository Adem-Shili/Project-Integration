package org.backend.stockease.service;

import java.util.List;
import java.util.Optional;

import org.backend.stockease.entity.Order;

public interface OrderService {
    Order createOrder(Long userId, String address, String deliveryOption);
    List<Order> getUserOrders(Long userId);
    Optional<Order> getOrderByNumber(String orderNumber);
    Optional<Order> getOrderById(Long orderId);
}

