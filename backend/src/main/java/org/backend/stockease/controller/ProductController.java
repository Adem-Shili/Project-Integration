package org.backend.stockease.controller;

import lombok.AllArgsConstructor;
import org.backend.stockease.entity.Product;
import org.backend.stockease.entity.Shop;
import org.backend.stockease.service.ProductService;
import org.backend.stockease.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@AllArgsConstructor

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ShopService shopService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // If seller, automatically assign product to their shop
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSeller = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"));
        
        // If seller didn't specify a shop, use the first one (for backward compatibility)
        // But ideally, shop should be specified in the request
        if (isSeller && product.getShop() == null) {
            try {
                Long userId = Long.parseLong(auth.getName());
                // Try to get any shop owned by the seller
                List<Shop> shops = shopService.getAllShopsByOwnerId(userId);
                if (shops.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null);
                }
                // Use the first shop if no shop specified
                product.setShop(shops.get(0));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
            }
        }
        
        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        // Verify seller owns the product or is admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            Product existingProduct = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
            
            if (existingProduct.getShop() == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            try {
                Long userId = Long.parseLong(auth.getName());
                // Check if seller owns any shop that matches the product's shop
                List<Shop> shops = shopService.getAllShopsByOwnerId(userId);
                boolean ownsShop = shops.stream()
                    .anyMatch(shop -> shop.getId().equals(existingProduct.getShop().getId()));
                
                if (!ownsShop) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        
        return productService.updateProduct(id, productDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        // Verify seller owns the product or is admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin) {
            Product existingProduct = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
            
            if (existingProduct.getShop() == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            try {
                Long userId = Long.parseLong(auth.getName());
                // Check if seller owns any shop that matches the product's shop
                List<Shop> shops = shopService.getAllShopsByOwnerId(userId);
                boolean ownsShop = shops.stream()
                    .anyMatch(shop -> shop.getId().equals(existingProduct.getShop().getId()));
                
                if (!ownsShop) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Product>> getProductsByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(productService.getProductsByShopId(shopId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<List<Product>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellers());
    }
}

