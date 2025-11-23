package org.backend.stockease.repository;

import org.backend.stockease.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category.id = :categoryId")
    List<Product> findActiveByCategoryId(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchActiveProducts(@Param("keyword") String keyword);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true")
    List<Product> findAllActive();
    
    List<Product> findByIsBestSellerTrue();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.isBestSeller = true")
    List<Product> findActiveBestSellers();
    
    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.isActive = true")
    List<Product> findByShopId(@Param("shopId") Long shopId);
    
    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.category.id = :categoryId")
    List<Product> findByShopIdAndCategoryId(@Param("shopId") Long shopId, @Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId")
    List<Product> findAllByShopId(@Param("shopId") Long shopId);
}

