package org.backend.stockease.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlatformStatisticsResponse {
    private Long totalShops;
    private Long activeShops;
    private BigDecimal totalSubscriptionRevenue;
    private BigDecimal monthlySubscriptionRevenue;
    private Long totalUsers;
    private Long totalProducts;
    private Long totalOrders;
    private BigDecimal totalSalesRevenue;
}

