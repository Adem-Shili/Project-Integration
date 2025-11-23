package org.backend.stockease.config;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.backend.stockease.entity.Category;
import org.backend.stockease.entity.Product;
import org.backend.stockease.entity.SubscriptionPlan;
import org.backend.stockease.entity.User;
import org.backend.stockease.entity.enums.Role;
import org.backend.stockease.repository.CategoryRepository;
import org.backend.stockease.repository.ProductRepository;
import org.backend.stockease.repository.SubscriptionPlanRepository;
import org.backend.stockease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Initialize Admin User
            initializeAdminUser();

            // Initialize subscription plans if they don't exist
            if (subscriptionPlanRepository.count() == 0) {
                initializeSubscriptionPlans();
            } else {
                System.out.println("ℹ️  Subscription plans already exist. Skipping subscription plan initialization.");
            }

            // Initialize categories if they don't exist
            if (categoryRepository.count() == 0) {
                initializeCategories();
            } else {
                System.out.println("ℹ️  Categories already exist. Skipping category initialization.");
            }
            
            // Initialize products if they don't exist
            if (productRepository.count() == 0) {
                initializeProducts();
                System.out.println("✅ Sample data initialized successfully!");
            } else {
                System.out.println("ℹ️  Products already exist. Skipping product initialization.");
            }
        } catch (Exception e) {
            System.err.println("❌ Error initializing data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void initializeAdminUser() {
        if (userRepository.findByEmail("admin").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Created default admin user.");
        } else {
            System.out.println("ℹ️  Admin user already exists. Skipping admin initialization.");
        }
    }

    private void initializeSubscriptionPlans() {
        List<SubscriptionPlan> plans = Arrays.asList(
            createSubscriptionPlan("free", "Free plan for getting started and understanding the platform", 
                new BigDecimal("0.00"), 1, 50, 100, true, false, false),
            createSubscriptionPlan("Basic", "Perfect for small shops just getting started", 
                new BigDecimal("29.99"), 1, 50, 100, true, false, false),
            createSubscriptionPlan("Professional", "Ideal for growing businesses", 
                new BigDecimal("79.99"), 1, 500, 1000, true, true, false),
            createSubscriptionPlan("Enterprise", "For established businesses with high volume", 
                new BigDecimal("199.99"), 1, -1, -1, true, true, true)
        );

        subscriptionPlanRepository.saveAll(plans);
        System.out.println("✅ Created " + plans.size() + " subscription plans");
    }

    private SubscriptionPlan createSubscriptionPlan(String name, String description, 
            BigDecimal monthlyPrice, Integer durationMonths, Integer maxProducts, 
            Integer maxOrdersPerMonth, Boolean analyticsEnabled, Boolean customDomainEnabled, 
            Boolean prioritySupport) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(name);
        plan.setDescription(description);
        plan.setMonthlyPrice(monthlyPrice);
        plan.setDurationMonths(durationMonths);
        plan.setMaxProducts(maxProducts);
        plan.setMaxOrdersPerMonth(maxOrdersPerMonth);
        plan.setAnalyticsEnabled(analyticsEnabled);
        plan.setCustomDomainEnabled(customDomainEnabled);
        plan.setPrioritySupport(prioritySupport);
        plan.setIsActive(true);
        return plan;
    }

    private void initializeCategories() {
        List<Category> categories = Arrays.asList(
            createCategory("Electronics", "Latest gadgets, computers, phones, and tech accessories", 
                "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400"),
            createCategory("Furniture", "Quality furniture for home and office spaces", 
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"),
            createCategory("Audio", "Headphones, speakers, and sound equipment", 
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"),
            createCategory("Home & Living", "Decor, kitchenware, and lifestyle products", 
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"),
            createCategory("Accessories", "Watches, bags, jewelry, and personal accessories", 
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400"),
            createCategory("Sports & Fitness", "Equipment for active lifestyle and fitness", 
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400")
        );

        categoryRepository.saveAll(categories);
        categoryRepository.flush(); // Ensure categories are persisted before querying
        System.out.println("✅ Created " + categories.size() + " categories");
    }

    private Category createCategory(String name, String description, String imageUrl) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        return category;
    }

    private void initializeProducts() {
        // Get categories - ensure they exist
        Category electronics = categoryRepository.findByName("Electronics")
            .orElseThrow(() -> new RuntimeException("Electronics category not found"));
        Category furniture = categoryRepository.findByName("Furniture")
            .orElseThrow(() -> new RuntimeException("Furniture category not found"));
        Category audio = categoryRepository.findByName("Audio")
            .orElseThrow(() -> new RuntimeException("Audio category not found"));
        Category homeLiving = categoryRepository.findByName("Home & Living")
            .orElseThrow(() -> new RuntimeException("Home & Living category not found"));
        Category accessories = categoryRepository.findByName("Accessories")
            .orElseThrow(() -> new RuntimeException("Accessories category not found"));
        Category sports = categoryRepository.findByName("Sports & Fitness")
            .orElseThrow(() -> new RuntimeException("Sports & Fitness category not found"));

        List<Product> products = Arrays.asList(
            // Electronics
            createProduct("Premium Laptop", "High-performance laptop for work and gaming with 16GB RAM and 512GB SSD", 
                new BigDecimal("1299.99"), new BigDecimal("1499.99"), 50, electronics, 4.8, true,
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"),
            createProduct("Smartphone Pro", "Latest model with advanced camera features and 5G connectivity", 
                new BigDecimal("899.99"), new BigDecimal("999.99"), 75, electronics, 4.7, true,
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"),
            createProduct("Gaming Mouse", "Comfortable gaming mouse with 16000 DPI", 
                new BigDecimal("449.99"), new BigDecimal("549.99"), 30, electronics, 4.6, false,
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"),
            createProduct("Wireless Mouse", "Ergonomic wireless mouse with precision tracking", 
                new BigDecimal("29.99"), null, 200, electronics, 4.5, false,
                "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400"),
            createProduct("Mechanical Keyboard", "RGB mechanical keyboard with Cherry MX switches", 
                new BigDecimal("129.99"), new BigDecimal("149.99"), 60, electronics, 4.7, false,
                "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400"),

            // Audio
            createProduct("Wireless Headphones", "Premium sound quality with active noise cancellation", 
                new BigDecimal("199.99"), new BigDecimal("249.99"), 100, audio, 4.8, true,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"),
            createProduct("Bluetooth Speaker", "Portable speaker with 360-degree sound and waterproof design", 
                new BigDecimal("79.99"), new BigDecimal("99.99"), 150, audio, 4.6, false,
                "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"),
            createProduct("Studio Headphones", "Professional studio headphones for music production", 
                new BigDecimal("149.99"), null, 80, audio, 4.7, false,
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"),

            // Furniture
            createProduct("Modern Office Desk", "Ergonomic standing desk with adjustable height", 
                new BigDecimal("399.99"), new BigDecimal("499.99"), 25, furniture, 4.5, false,
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"),
            createProduct("Comfortable Chair", "Ergonomic chair with lumbar support and adjustable arms", 
                new BigDecimal("249.99"), new BigDecimal("299.99"), 40, furniture, 4.6, true,
                "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400"),
            createProduct("Bookshelf Unit", "5-tier bookshelf with modern design", 
                new BigDecimal("179.99"), null, 35, furniture, 4.4, false,
                "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=400"),

            // Home & Living
            createProduct("Smart LED Lights", "Color-changing LED strip lights with app control", 
                new BigDecimal("49.99"), new BigDecimal("69.99"), 120, homeLiving, 4.5, false,
                "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400"),
            createProduct("Coffee Maker", "Programmable coffee maker with thermal carafe", 
                new BigDecimal("89.99"), null, 90, homeLiving, 4.6, false,
                "https://images.unsplash.com/photo-1517668808823-bfcece9b5eab?w=400"),
            createProduct("Air Purifier", "HEPA air purifier for rooms up to 300 sq ft", 
                new BigDecimal("199.99"), new BigDecimal("249.99"), 50, homeLiving, 4.7, false,
                "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400"),

            // Accessories
            createProduct("Smart Watch", "Fitness tracker with heart rate monitor and GPS", 
                new BigDecimal("199.99"), new BigDecimal("249.99"), 100, accessories, 4.7, true,
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"),
            createProduct("Leather Wallet", "Genuine leather wallet with RFID blocking", 
                new BigDecimal("39.99"), null, 200, accessories, 4.5, false,
                "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400"),
            createProduct("Sunglasses", "UV protection sunglasses with polarized lenses", 
                new BigDecimal("79.99"), new BigDecimal("99.99"), 150, accessories, 4.6, false,
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"),

            // Sports & Fitness
            createProduct("Yoga Mat", "Non-slip yoga mat with carrying strap", 
                new BigDecimal("29.99"), new BigDecimal("39.99"), 180, sports, 4.6, false,
                "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"),
            createProduct("Dumbbell Set", "Adjustable dumbbell set 5-25 lbs per dumbbell", 
                new BigDecimal("149.99"), new BigDecimal("179.99"), 45, sports, 4.7, false,
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"),
            createProduct("Running Shoes", "Lightweight running shoes with cushioned sole", 
                new BigDecimal("89.99"), new BigDecimal("119.99"), 120, sports, 4.8, true,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400")
        );

        productRepository.saveAll(products);
        System.out.println("✅ Created " + products.size() + " products");
    }

    private Product createProduct(String name, String description, BigDecimal price, 
                                  BigDecimal originalPrice, Integer stock, Category category, 
                                  Double rating, Boolean isBestSeller, String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setOriginalPrice(originalPrice);
        product.setStock(stock);
        product.setCategory(category);
        product.setRating(rating);
        product.setIsBestSeller(isBestSeller);
        product.setImageUrl(imageUrl);
        return product;
    }
}

