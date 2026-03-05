package com.example.ExpenseTracker2.controller;
import com.example.ExpenseTracker2.entity.Expense;
import com.example.ExpenseTracker2.service.ExpenseService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin("*")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/{username}")
    public Expense addExpense(@PathVariable String username,
                              @RequestBody Expense expense) {
        return expenseService.addExpense(username, expense);
    }

    @GetMapping("/{username}")
    public List<Expense> getUserExpenses(@PathVariable String username) {
        return expenseService.getUserExpenses(username);
    }

    @GetMapping("/{username}/category/{category}")
    public List<Expense> getByCategory(@PathVariable String username,
                                       @PathVariable String category) {
        return expenseService.getByCategory(username, category);
    }

    @GetMapping("/{username}/date")
    public List<Expense> getByDateRange(
            @PathVariable String username,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate start,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate end) {

        return expenseService.getByDateRange(username, start, end);
    }

    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return "Expense deleted successfully";
    }
}
