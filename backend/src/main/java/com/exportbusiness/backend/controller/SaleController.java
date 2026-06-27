package com.exportbusiness.backend.controller;

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

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    // GET all sales (paginated)
    @GetMapping
    public Page<Sale> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return saleRepository.findAll(PageRequest.of(page, size, Sort.by("saleDate").descending()));
    }

    // GET single sale
    @GetMapping("/{id}")
    public ResponseEntity<Sale> getById(@PathVariable Long id) {
        return saleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET sales by date range
    @GetMapping("/by-date")
    public List<Sale> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return saleRepository.findBySaleDateBetweenOrderBySaleDateDesc(start, end);
    }

    // GET sales by customer name
    @GetMapping("/by-customer")
    public List<Sale> getByCustomer(@RequestParam String name) {
        return saleRepository.findByCustomerNameContainingIgnoreCase(name);
    }

    // GET revenue by product (for charts)
    @GetMapping("/summary/by-product")
    public List<Object[]> getRevenueByProduct() {
        return saleRepository.revenueByProduct();
    }

    // GET monthly revenue (for charts)
    @GetMapping("/summary/monthly")
    public List<Object[]> getMonthlyRevenue(@RequestParam(defaultValue = "2024") int year) {
        return saleRepository.monthlyRevenue(year);
    }

    // POST create sale (also deducts stock)
    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid Sale sale) {
        // Verify product exists
        if (sale.getProduct() == null || sale.getProduct().getId() == null) {
            return ResponseEntity.badRequest().body("Product is required");
        }
        return productRepository.findById(sale.getProduct().getId()).map(product -> {
            // Check sufficient stock
            int requested = sale.getQuantity().intValue();
            if (product.getStockQuantity() < requested) {
                return ResponseEntity.badRequest()
                        .body("Insufficient stock. Available: " + product.getStockQuantity());
            }
            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - requested);
            productRepository.save(product);
            // Save sale
            sale.setProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(saleRepository.save(sale));
        }).orElse(ResponseEntity.badRequest().body("Product not found"));
    }

    // PUT update sale
    @PutMapping("/{id}")
    public ResponseEntity<Sale> update(@PathVariable Long id, @RequestBody @Valid Sale sale) {
        if (!saleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sale.setId(id);
        return ResponseEntity.ok(saleRepository.save(sale));
    }

    // DELETE sale
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!saleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        saleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
