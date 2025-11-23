package org.backend.stockease.service.implementation;

import org.backend.stockease.entity.Product;
import org.backend.stockease.repository.ProductRepository;
import org.backend.stockease.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAllActive();
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findActiveByCategoryId(categoryId);
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        return productRepository.searchActiveProducts(keyword);
    }

    @Override
    public List<Product> getBestSellers() {
        return productRepository.findActiveBestSellers();
    }

    @Override
    public List<Product> getProductsByShopId(Long shopId) {
        return productRepository.findByShopId(shopId);
    }

    @Override
    public List<Product> getAllProductsByShopId(Long shopId) {
        return productRepository.findAllByShopId(shopId);
    }

    @Override
    public Product createProduct(Product product) {
        // Set isActive to true by default if not specified
        if (product.getIsActive() == null) {
            product.setIsActive(true);
        }
        return productRepository.save(product);
    }

    @Override
    public Optional<Product> updateProduct(Long id, Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setOriginalPrice(productDetails.getOriginalPrice());
            product.setStock(productDetails.getStock());
            product.setImageUrl(productDetails.getImageUrl());
            product.setRating(productDetails.getRating());
            product.setIsBestSeller(productDetails.getIsBestSeller());
            if (productDetails.getIsActive() != null) product.setIsActive(productDetails.getIsActive());
            product.setCategory(productDetails.getCategory());
            if (productDetails.getShop() != null) product.setShop(productDetails.getShop());
            return productRepository.save(product);
        });
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}

