package com.exportbusiness.backend.controller;

import com.exportbusiness.backend.entity.Expense;
import com.exportbusiness.backend.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    // GET all expenses (paginated)
    @GetMapping
    public Page<Expense> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return expenseRepository.findAll(PageRequest.of(page, size, sort));
    }

    // GET single expense
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getById(@PathVariable Long id) {
        return expenseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET expenses by date range
    @GetMapping("/by-date")
    public List<Expense> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return expenseRepository.findByDateBetweenOrderByDateDesc(start, end);
    }

    // GET expenses by category
    @GetMapping("/by-category/{category}")
    public List<Expense> getByCategory(@PathVariable String category) {
        return expenseRepository.findByCategoryOrderByDateDesc(category);
    }

    // GET summary by category (for charts)
    @GetMapping("/summary/by-category")
    public List<Object[]> getSummaryByCategory() {
        return expenseRepository.sumByCategory();
    }

    // POST create expense
    @PostMapping
    public Expense create(@RequestBody @Valid Expense expense) {
        return expenseRepository.save(expense);
    }

    // PUT update expense
    @PutMapping("/{id}")
    public ResponseEntity<Expense> update(@PathVariable Long id, @RequestBody @Valid Expense expense) {
        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        expense.setId(id);
        return ResponseEntity.ok(expenseRepository.save(expense));
    }

    // DELETE expense
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        expenseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
