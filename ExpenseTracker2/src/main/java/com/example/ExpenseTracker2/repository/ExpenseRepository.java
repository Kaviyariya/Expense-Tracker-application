package com.example.ExpenseTracker2.repository;
import com.example.ExpenseTracker2.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserUsername(String username);

    List<Expense> findByUserUsernameAndCategory(String username, String category);

    List<Expense> findByUserUsernameAndDateBetween(String username, LocalDate start, LocalDate end);
}
