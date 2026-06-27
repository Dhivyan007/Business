package com.exportbusiness.backend.repository;

import com.exportbusiness.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    // Find low stock products (stockQuantity below threshold)
    List<Product> findByStockQuantityLessThan(Integer threshold);

    List<Product> findByNameContainingIgnoreCase(String name);
}
