package com.example.ExpenseTracker2.service;

import com.example.ExpenseTracker2.entity.Expense;
import com.example.ExpenseTracker2.entity.User;
import com.example.ExpenseTracker2.repository.ExpenseRepository;
import com.example.ExpenseTracker2.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository,
                          UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public Expense addExpense(String username, Expense expense) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        expense.setUser(user);   // 🔥 MUST HAVE

        return expenseRepository.save(expense);
    }

    public List<Expense> getUserExpenses(String username) {
        return expenseRepository.findByUserUsername(username);
    }

    public Expense updateExpense(Long id, Expense newExpense) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expense.setAmount(newExpense.getAmount());
        expense.setCategory(newExpense.getCategory());
        expense.setDescription(newExpense.getDescription());
        expense.setDate(newExpense.getDate());

        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}