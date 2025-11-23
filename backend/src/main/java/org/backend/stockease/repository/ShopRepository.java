package org.backend.stockease.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.backend.stockease.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByOwnerId(Long ownerId);
    List<Shop> findAllByOwnerId(Long ownerId);
    Optional<Shop> findByName(String name);
    List<Shop> findByIsActiveTrue();
    
    @Query("SELECT COUNT(s) FROM Shop s WHERE s.isActive = true")
    Long countActiveShops();
    
    @Query("SELECT SUM(sp.monthlyPrice) FROM Shop s JOIN s.subscriptionPlan sp WHERE s.isActive = true")
    BigDecimal calculateTotalMonthlyRevenue();

    @Query("SELECT s FROM Shop s LEFT JOIN FETCH s.owner LEFT JOIN FETCH s.subscriptionPlan")
    List<Shop> findAllWithOwnerAndPlan();
}

