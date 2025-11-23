package org.backend.stockease.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopCreationRequest {
    private String shopName;
    private String description;
    private Long subscriptionPlanId;
}

