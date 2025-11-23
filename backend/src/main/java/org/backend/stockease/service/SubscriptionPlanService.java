package org.backend.stockease.service;

import org.backend.stockease.entity.SubscriptionPlan;

import java.util.List;
import java.util.Optional;

public interface SubscriptionPlanService {
    List<SubscriptionPlan> getAllActivePlans();
    Optional<SubscriptionPlan> getPlanById(Long id);
    SubscriptionPlan createPlan(SubscriptionPlan plan);
    Optional<SubscriptionPlan> updatePlan(Long id, SubscriptionPlan planDetails);
    void deletePlan(Long id);
}



