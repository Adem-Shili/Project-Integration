package org.backend.stockease.service.implementation;

import org.backend.stockease.entity.Delivery;
import org.backend.stockease.repository.DeliveryRepository;
import org.backend.stockease.repository.OrderRepository;
import org.backend.stockease.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DeliveryServiceImpl implements DeliveryService {
    
    @Autowired
    private DeliveryRepository deliveryRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Optional<Delivery> getDeliveryByTrackingNumber(String trackingNumber) {
        return deliveryRepository.findByTrackingNumber(trackingNumber);
    }

    @Override
    public Optional<Delivery> getDeliveryByOrderId(Long orderId) {
        return deliveryRepository.findByOrderId(orderId);
    }

    @Override
    public Optional<Delivery> getDeliveryByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
            .flatMap(order -> deliveryRepository.findByOrderId(order.getId()));
    }
}

