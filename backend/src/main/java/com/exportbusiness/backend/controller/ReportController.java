package com.exportbusiness.backend.controller;

import com.exportbusiness.backend.repository.ExpenseRepository;
import com.exportbusiness.backend.repository.SaleRepository;
import com.exportbusiness.backend.repository.VehicleLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private VehicleLogRepository vehicleLogRepository;

    // GET Profit & Loss summary for a date range
    @GetMapping("/profit-loss")
    public Map<String, Object> getProfitLoss(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        BigDecimal totalRevenue = saleRepository.sumRevenueByDateRange(start, end);
        BigDecimal totalExpenses = expenseRepository.sumAmountByDateRange(start, end);
        BigDecimal fuelCost = vehicleLogRepository.sumByTypeAndDateRange("FUEL", start, end);
        BigDecimal maintenanceCost = vehicleLogRepository.sumByTypeAndDateRange("MAINTENANCE", start, end);

        // Defaults for null (no records in range)
        totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        totalExpenses = totalExpenses != null ? totalExpenses : BigDecimal.ZERO;
        fuelCost = fuelCost != null ? fuelCost : BigDecimal.ZERO;
        maintenanceCost = maintenanceCost != null ? maintenanceCost : BigDecimal.ZERO;

        BigDecimal vehicleCosts = fuelCost.add(maintenanceCost);
        BigDecimal totalCosts = totalExpenses.add(vehicleCosts);
        BigDecimal netProfit = totalRevenue.subtract(totalCosts);

        Map<String, Object> report = new HashMap<>();
        report.put("startDate", start);
        report.put("endDate", end);
        report.put("totalRevenue", totalRevenue);
        report.put("totalExpenses", totalExpenses);
        report.put("fuelCost", fuelCost);
        report.put("maintenanceCost", maintenanceCost);
        report.put("vehicleCosts", vehicleCosts);
        report.put("totalCosts", totalCosts);
        report.put("netProfit", netProfit);

        return report;
    }

    // GET Dashboard summary (current month)
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        BigDecimal monthRevenue = saleRepository.sumRevenueByDateRange(startOfMonth, now);
        BigDecimal monthExpenses = expenseRepository.sumAmountByDateRange(startOfMonth, now);

        monthRevenue = monthRevenue != null ? monthRevenue : BigDecimal.ZERO;
        monthExpenses = monthExpenses != null ? monthExpenses : BigDecimal.ZERO;

        // Revenue by product (top products)
        List<Object[]> revenueByProduct = saleRepository.revenueByProduct();

        // Expenses by category
        List<Object[]> expensesByCategory = expenseRepository.sumByCategory();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("monthRevenue", monthRevenue);
        dashboard.put("monthExpenses", monthExpenses);
        dashboard.put("monthProfit", monthRevenue.subtract(monthExpenses));
        dashboard.put("revenueByProduct", revenueByProduct);
        dashboard.put("expensesByCategory", expensesByCategory);

        return dashboard;
    }

    // GET monthly revenue chart data for a given year
    @GetMapping("/monthly-revenue")
    public List<Object[]> getMonthlyRevenue(@RequestParam(defaultValue = "2024") int year) {
        return saleRepository.monthlyRevenue(year);
    }
}
