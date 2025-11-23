package org.backend.stockease.service;

import org.backend.stockease.dto.ShopCreationRequest;
import org.backend.stockease.dto.ShopStatisticsResponse;
import org.backend.stockease.entity.Shop;

import java.util.List;
import java.util.Optional;

public interface ShopService {
    Shop createShop(Long ownerId, ShopCreationRequest request);
    Optional<Shop> getShopByOwnerId(Long ownerId);
    Optional<Shop> getShopById(Long id);
    List<Shop> getAllShops();
    List<Shop> getActiveShops();
    Optional<Shop> updateShop(Long id, Shop shopDetails);
    void deleteShop(Long id);
    ShopStatisticsResponse getShopStatistics(Long shopId);
    List<Shop> getShopsByOwnerId(Long ownerId);
    List<Shop> getAllShopsByOwnerId(Long ownerId);
}

