package org.backend.stockease.service.implementation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.backend.stockease.entity.Cart;
import org.backend.stockease.entity.CartItem;
import org.backend.stockease.entity.Delivery;
import org.backend.stockease.entity.Order;
import org.backend.stockease.entity.OrderItem;
import org.backend.stockease.entity.User;
import org.backend.stockease.entity.enums.DeliveryStatus;
import org.backend.stockease.entity.enums.OrderStatus;
import org.backend.stockease.repository.CartItemRepository;
import org.backend.stockease.repository.CartRepository;
import org.backend.stockease.repository.DeliveryRepository;
import org.backend.stockease.repository.OrderItemRepository;
import org.backend.stockease.repository.OrderRepository;
import org.backend.stockease.repository.UserRepository;
import org.backend.stockease.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Override
    @Transactional
    public Order createOrder(Long userId, String address, String deliveryOption) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Cart is empty"));
        
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Calculate total amount first
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            totalAmount = totalAmount.add(cartItem.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }
        
        // Create and save Order first
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUser(user);
        // Use PENDING status (maps to "Ordered" in UI) since database constraint doesn't include ORDERED yet
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);
        order.setDeliveryOption(deliveryOption != null ? deliveryOption : "standard");
        order = orderRepository.save(order); // Save order first to get an ID
        
        // Now create and save OrderItems with the persisted Order
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // Now order has an ID
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }
        
        // Create delivery
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setTrackingNumber("TRK" + order.getOrderNumber());
        delivery.setAddress(address);
        delivery.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(5));
        deliveryRepository.save(delivery);
        
        // Clear cart
        cartItemRepository.deleteByCartId(cart.getId());
        
        return order;
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Optional<Order> getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    @Override
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
}

