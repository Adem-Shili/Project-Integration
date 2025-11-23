package org.backend.stockease.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopStatisticsResponse {
    private Long shopId;
    private String shopName;
    private BigDecimal totalRevenue;
    private Integer totalOrders;
    private Integer totalProducts;
    private Integer activeProducts;
    private BigDecimal monthlyRevenue;
    private Integer monthlyOrders;
}

