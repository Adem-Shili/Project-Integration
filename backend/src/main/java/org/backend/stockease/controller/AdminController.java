package org.backend.stockease.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.backend.stockease.dto.PlatformStatisticsResponse;
import org.backend.stockease.entity.OrderItem;
import org.backend.stockease.entity.Shop;
import org.backend.stockease.repository.OrderItemRepository;
import org.backend.stockease.repository.OrderRepository;
import org.backend.stockease.repository.ProductRepository;
import org.backend.stockease.repository.ShopRepository;
import org.backend.stockease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private ShopRepository shopRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping("/statistics")
    public ResponseEntity<PlatformStatisticsResponse> getPlatformStatistics() {
        // Total shops
        long totalShops = shopRepository.count();
        long activeShops = shopRepository.countActiveShops();
        
        // Total subscription revenue (monthly)
        BigDecimal monthlySubscriptionRevenue = shopRepository.findAll().stream()
            .filter(Shop::getIsActive)
            .map(shop -> shop.getSubscriptionPlan().getMonthlyPrice())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Total subscription revenue (all time - approximate)
        BigDecimal totalSubscriptionRevenue = shopRepository.findAll().stream()
            .filter(Shop::getIsActive)
            .map(shop -> {
                long monthsActive = java.time.temporal.ChronoUnit.MONTHS.between(
                    shop.getSubscriptionStartDate(), 
                    shop.getSubscriptionEndDate().isAfter(LocalDateTime.now()) 
                        ? LocalDateTime.now() 
                        : shop.getSubscriptionEndDate()
                );
                return shop.getSubscriptionPlan().getMonthlyPrice()
                    .multiply(BigDecimal.valueOf(Math.max(1, monthsActive)));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Total users
        long totalUsers = userRepository.count();
        
        // Total products
        long totalProducts = productRepository.count();
        
        // Total orders
        long totalOrders = orderRepository.count();
        
        // Total sales revenue (from all orders)
        List<OrderItem> allOrderItems = orderItemRepository.findAll();
        BigDecimal totalSalesRevenue = allOrderItems.stream()
            .map(oi -> oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        PlatformStatisticsResponse stats = new PlatformStatisticsResponse(
            totalShops,
            activeShops,
            totalSubscriptionRevenue,
            monthlySubscriptionRevenue,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSalesRevenue
        );
        
        return ResponseEntity.ok(stats);
    }

   /*  @GetMapping("/shops")
    public ResponseEntity<List<Shop>> getAllShops() {
        return ResponseEntity.ok(shopRepository.findAll());
    }*/

    @GetMapping("/shops")
public ResponseEntity<List<Shop>> getAllShopsWithOwnerAndPlan() {
    return ResponseEntity.ok(shopRepository.findAllWithOwnerAndPlan());
}
}

