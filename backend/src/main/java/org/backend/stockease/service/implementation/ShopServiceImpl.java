package org.backend.stockease.service.implementation;

import org.backend.stockease.dto.ShopCreationRequest;
import org.backend.stockease.dto.ShopStatisticsResponse;
import org.backend.stockease.entity.*;
import org.backend.stockease.repository.*;
import org.backend.stockease.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShopServiceImpl implements ShopService {
    
    @Autowired
    private ShopRepository shopRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public Shop createShop(Long ownerId, ShopCreationRequest request) {
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getSubscriptionPlanId())
            .orElseThrow(() -> new RuntimeException("Subscription plan not found"));
        
        // Check if shop name is already taken
        if (shopRepository.findByName(request.getShopName()).isPresent()) {
            throw new RuntimeException("Shop name already exists");
        }
        
        Shop shop = new Shop();
        shop.setName(request.getShopName());
        shop.setDescription(request.getDescription());
        shop.setOwner(owner);
        shop.setSubscriptionPlan(plan);
        shop.setSubscriptionStartDate(LocalDateTime.now());
        shop.setSubscriptionEndDate(LocalDateTime.now().plusMonths(plan.getDurationMonths()));
        shop.setIsActive(true);
        shop.setCreatedAt(LocalDateTime.now());
        shop.setTotalRevenue(BigDecimal.ZERO);
        shop.setTotalOrders(0);
        
        return shopRepository.save(shop);
    }

    @Override
    public Optional<Shop> getShopByOwnerId(Long ownerId) {
        return shopRepository.findByOwnerId(ownerId);
    }

    @Override
    public Optional<Shop> getShopById(Long id) {
        return shopRepository.findById(id);
    }

    @Override
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    @Override
    public List<Shop> getActiveShops() {
        return shopRepository.findByIsActiveTrue();
    }

    @Override
    public Optional<Shop> updateShop(Long id, Shop shopDetails) {
        return shopRepository.findById(id).map(shop -> {
            if (shopDetails.getName() != null) shop.setName(shopDetails.getName());
            if (shopDetails.getDescription() != null) shop.setDescription(shopDetails.getDescription());
            if (shopDetails.getIsActive() != null) shop.setIsActive(shopDetails.getIsActive());
            return shopRepository.save(shop);
        });
    }

    @Override
    public void deleteShop(Long id) {
        shopRepository.deleteById(id);
    }

    @Override
    public ShopStatisticsResponse getShopStatistics(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
            .orElseThrow(() -> new RuntimeException("Shop not found"));
        
        // Get all products for this shop
        List<Product> shopProducts = productRepository.findAll().stream()
            .filter(p -> p.getShop() != null && p.getShop().getId().equals(shopId))
            .collect(Collectors.toList());
        
        int totalProducts = shopProducts.size();
        int activeProducts = (int) shopProducts.stream()
            .filter(p -> p.getStock() > 0)
            .count();
        
        // Calculate revenue from order items
        List<OrderItem> allOrderItems = orderItemRepository.findAll();
        BigDecimal totalRevenue = allOrderItems.stream()
            .filter(oi -> oi.getProduct().getShop() != null && 
                         oi.getProduct().getShop().getId().equals(shopId))
            .map(oi -> oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Count orders (unique orders that contain products from this shop)
        long totalOrders = allOrderItems.stream()
            .filter(oi -> oi.getProduct().getShop() != null && 
                         oi.getProduct().getShop().getId().equals(shopId))
            .map(oi -> oi.getOrder().getId())
            .distinct()
            .count();
        
        // Calculate monthly revenue (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        BigDecimal monthlyRevenue = allOrderItems.stream()
            .filter(oi -> oi.getProduct().getShop() != null && 
                         oi.getProduct().getShop().getId().equals(shopId) &&
                         oi.getOrder().getOrderDate().isAfter(thirtyDaysAgo))
            .map(oi -> oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Count monthly orders
        long monthlyOrders = allOrderItems.stream()
            .filter(oi -> oi.getProduct().getShop() != null && 
                         oi.getProduct().getShop().getId().equals(shopId) &&
                         oi.getOrder().getOrderDate().isAfter(thirtyDaysAgo))
            .map(oi -> oi.getOrder().getId())
            .distinct()
            .count();
        
        return new ShopStatisticsResponse(
            shopId,
            shop.getName(),
            totalRevenue,
            (int) totalOrders,
            totalProducts,
            activeProducts,
            monthlyRevenue,
            (int) monthlyOrders
        );
    }

    @Override
    public List<Shop> getShopsByOwnerId(Long ownerId) {
        return shopRepository.findByOwnerId(ownerId)
            .map(List::of)
            .orElse(List.of());
    }

    @Override
    public List<Shop> getAllShopsByOwnerId(Long ownerId) {
        return shopRepository.findAllByOwnerId(ownerId);
    }
}

