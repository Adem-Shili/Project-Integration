package org.backend.stockease.service;

import org.backend.stockease.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Long id);
    List<Product> getProductsByCategory(Long categoryId);
    List<Product> searchProducts(String keyword);
    List<Product> getBestSellers();
    List<Product> getProductsByShopId(Long shopId);
    List<Product> getAllProductsByShopId(Long shopId); // Includes inactive products
    Product createProduct(Product product);
    Optional<Product> updateProduct(Long id, Product productDetails);
    void deleteProduct(Long id);
}

