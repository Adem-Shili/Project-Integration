package org.backend.stockease.service;

import org.backend.stockease.entity.Delivery;

import java.util.Optional;

public interface DeliveryService {
    Optional<Delivery> getDeliveryByTrackingNumber(String trackingNumber);
    Optional<Delivery> getDeliveryByOrderId(Long orderId);
    Optional<Delivery> getDeliveryByOrderNumber(String orderNumber);
}

