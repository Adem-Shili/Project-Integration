package org.backend.stockease.repository;

import java.util.List;
import java.util.Optional;

import org.backend.stockease.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Keep old method for backward compatibility
    default List<Order> findByUserId(Long userId) {
        return findByUserIdOrderByOrderDateDesc(userId);
    }
}

