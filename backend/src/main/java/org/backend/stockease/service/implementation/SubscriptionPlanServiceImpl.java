package org.backend.stockease.service.implementation;

import org.backend.stockease.entity.SubscriptionPlan;
import org.backend.stockease.repository.SubscriptionPlanRepository;
import org.backend.stockease.service.SubscriptionPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {
    
    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Override
    public List<SubscriptionPlan> getAllActivePlans() {
        return subscriptionPlanRepository.findByIsActiveTrue();
    }

    @Override
    public Optional<SubscriptionPlan> getPlanById(Long id) {
        return subscriptionPlanRepository.findById(id);
    }

    @Override
    public SubscriptionPlan createPlan(SubscriptionPlan plan) {
        return subscriptionPlanRepository.save(plan);
    }

    @Override
    public Optional<SubscriptionPlan> updatePlan(Long id, SubscriptionPlan planDetails) {
        return subscriptionPlanRepository.findById(id).map(plan -> {
            if (planDetails.getName() != null) plan.setName(planDetails.getName());
            if (planDetails.getDescription() != null) plan.setDescription(planDetails.getDescription());
            if (planDetails.getMonthlyPrice() != null) plan.setMonthlyPrice(planDetails.getMonthlyPrice());
            if (planDetails.getDurationMonths() != null) plan.setDurationMonths(planDetails.getDurationMonths());
            if (planDetails.getMaxProducts() != null) plan.setMaxProducts(planDetails.getMaxProducts());
            if (planDetails.getMaxOrdersPerMonth() != null) plan.setMaxOrdersPerMonth(planDetails.getMaxOrdersPerMonth());
            if (planDetails.getAnalyticsEnabled() != null) plan.setAnalyticsEnabled(planDetails.getAnalyticsEnabled());
            if (planDetails.getCustomDomainEnabled() != null) plan.setCustomDomainEnabled(planDetails.getCustomDomainEnabled());
            if (planDetails.getPrioritySupport() != null) plan.setPrioritySupport(planDetails.getPrioritySupport());
            if (planDetails.getIsActive() != null) plan.setIsActive(planDetails.getIsActive());
            return subscriptionPlanRepository.save(plan);
        });
    }

    @Override
    public void deletePlan(Long id) {
        subscriptionPlanRepository.deleteById(id);
    }
}

