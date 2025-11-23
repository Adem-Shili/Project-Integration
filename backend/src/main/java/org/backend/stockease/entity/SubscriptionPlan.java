package org.backend.stockease.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subscription_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal monthlyPrice;

    @Column(nullable = false)
    private Integer durationMonths;

    private Integer maxProducts;
    
    private Integer maxOrdersPerMonth;
    
    private Boolean analyticsEnabled = true;
    
    private Boolean customDomainEnabled = false;
    
    private Boolean prioritySupport = false;

    @OneToMany(mappedBy = "subscriptionPlan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Shop> shops;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Boolean isActive = true;

    //getter and setter 
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public BigDecimal getMonthlyPrice() {
        return monthlyPrice;
    }
    public void setMonthlyPrice(BigDecimal monthlyPrice) {
        this.monthlyPrice = monthlyPrice;
    }
    public Integer getDurationMonths() {
        return durationMonths;
    }
    public void setDurationMonths(Integer durationMonths) {
        this.durationMonths = durationMonths;
    }
    public Integer getMaxProducts() {
        return maxProducts;
    }
    public void setMaxProducts(Integer maxProducts) {
        this.maxProducts = maxProducts;
    }
    public Integer getMaxOrdersPerMonth() {
        return maxOrdersPerMonth;
    }
    public void setMaxOrdersPerMonth(Integer maxOrdersPerMonth) {
        this.maxOrdersPerMonth = maxOrdersPerMonth;
    }
    public Boolean getAnalyticsEnabled() {
        return analyticsEnabled;
    }
    public void setAnalyticsEnabled(Boolean analyticsEnabled) {
        this.analyticsEnabled = analyticsEnabled;
    }
    public Boolean getCustomDomainEnabled() {
        return customDomainEnabled;
    }
    public void setCustomDomainEnabled(Boolean customDomainEnabled) {
        this.customDomainEnabled = customDomainEnabled;
    }
    public Boolean getPrioritySupport() {
        return prioritySupport;
    }
    public void setPrioritySupport(Boolean prioritySupport) {
        this.prioritySupport = prioritySupport;
    }
    public Boolean getIsActive() {
        return isActive;
    }
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}

