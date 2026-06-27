package com.exportbusiness.backend.repository;

import com.exportbusiness.backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findBySaleDateBetweenOrderBySaleDateDesc(LocalDate start, LocalDate end);

    List<Sale> findByCustomerNameContainingIgnoreCase(String customerName);

    List<Sale> findByProductId(Long productId);

    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.saleDate BETWEEN :start AND :end AND s.status = 'COMPLETED'")
    BigDecimal sumRevenueByDateRange(LocalDate start, LocalDate end);

    @Query("SELECT s.product.name, SUM(s.totalAmount) FROM Sale s WHERE s.status = 'COMPLETED' GROUP BY s.product.name ORDER BY SUM(s.totalAmount) DESC")
    List<Object[]> revenueByProduct();

    @Query("SELECT MONTH(s.saleDate), SUM(s.totalAmount) FROM Sale s WHERE YEAR(s.saleDate) = :year AND s.status = 'COMPLETED' GROUP BY MONTH(s.saleDate)")
    List<Object[]> monthlyRevenue(int year);
}
