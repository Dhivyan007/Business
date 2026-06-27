package com.exportbusiness.backend.controller;

import com.exportbusiness.backend.entity.Product;
import com.exportbusiness.backend.entity.Sale;
import com.exportbusiness.backend.repository.ProductRepository;
import com.exportbusiness.backend.repository.SaleRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public Page<Sale> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return saleRepository.findAll(PageRequest.of(page, size, Sort.by("saleDate").descending()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getById(@PathVariable Long id) {
        return saleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-date")
    public List<Sale> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return saleRepository.findBySaleDateBetweenOrderBySaleDateDesc(start, end);
    }

    @GetMapping("/by-customer")
    public List<Sale> getByCustomer(@RequestParam String name) {
        return saleRepository.findByCustomerNameContainingIgnoreCase(name);
    }

    @GetMapping("/summary/by-product")
    public List<Object[]> getRevenueByProduct() {
        return saleRepository.revenueByProduct();
    }

    @GetMapping("/summary/monthly")
    public List<Object[]> getMonthlyRevenue(@RequestParam(defaultValue = "2024") int year) {
        return saleRepository.monthlyRevenue(year);
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody @Valid Sale sale) {
        if (sale.getProduct() == null || sale.getProduct().getId() == null) {
            return ResponseEntity.badRequest().body("Product is required");
        }
        Optional<Product> productOpt = productRepository.findById(sale.getProduct().getId());
        if (productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Product not found");
        }
        Product product = productOpt.get();
        int requested = sale.getQuantity().intValue();
        if (product.getStockQuantity() < requested) {
            return ResponseEntity.badRequest()
                    .body("Insufficient stock. Available: " + product.getStockQuantity());
        }
        product.setStockQuantity(product.getStockQuantity() - requested);
        productRepository.save(product);
        sale.setProduct(product);
        saleRepository.save(sale);
        return ResponseEntity.status(HttpStatus.CREATED).body("Sale saved successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sale> update(@PathVariable Long id, @RequestBody @Valid Sale sale) {
        if (!saleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sale.setId(id);
        return ResponseEntity.ok(saleRepository.save(sale));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!saleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        saleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
