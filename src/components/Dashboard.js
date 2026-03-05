import React, { useEffect, useState, useMemo } from "react";
import { getExpenses, addExpense, deleteExpense, updateExpense } from "../api";
import ExpenseForm from "./ExpenseForm";
import * as XLSX from "xlsx";

const CATEGORIES = ["All", "Food & Dining", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

function Dashboard({ user, setUser }) {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // View tabs
  const [activeView, setActiveView] = useState("list");

  const fetchExpenses = async () => {
    try { const res = await getExpenses(user.username); setExpenses(res.data); }
    catch (err) { console.error("Failed to load expenses", err); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSave = async (data) => {
    try {
      if (editing && editing.expenseId) { await updateExpense(editing.expenseId, data); }
      else { await addExpense(user.username, data); }
      setShowForm(false); setEditing(null); fetchExpenses();
    } catch (err) { alert("Failed to save expense"); }
  };

  const handleDelete = async (id) => {
    try { await deleteExpense(id); fetchExpenses(); } catch (err) { alert("Failed to delete"); }
  };

  // ========== FEATURE 1: Filter by date & category ==========
  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filterCategory !== "All" && e.category !== filterCategory) return false;
      if (filterDateFrom && e.date < filterDateFrom) return false;
      if (filterDateTo && e.date > filterDateTo) return false;
      return true;
    });
  }, [expenses, filterCategory, filterDateFrom, filterDateTo]);

  // ========== FEATURE 2: Total expense ==========
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  // ========== FEATURE 3: Category-wise summary ==========
  const categoryWise = useMemo(() => {
    const map = {};
    filtered.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  // ========== FEATURE 4: Monthly report ==========
  const monthlyReport = useMemo(() => {
    const map = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    filtered.forEach((e) => {
      const d = new Date(e.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      map[key] = (map[key] || 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => {
      const [mA, yA] = a[0].split(" ");
      const [mB, yB] = b[0].split(" ");
      return Number(yA) - Number(yB) || monthNames.indexOf(mA) - monthNames.indexOf(mB);
    });
  }, [filtered]);

  // ========== FEATURE 5: Export to Excel ==========
  const exportToExcel = () => {
    const data = filtered.map((e) => ({
      Date: e.date, Category: e.category, Description: e.description, Amount: e.amount,
    }));
    const catData = categoryWise.map(([cat, amt]) => ({ Category: cat, Total: amt }));
    const monthData = monthlyReport.map(([month, amt]) => ({ Month: month, Total: amt }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Expenses");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(catData), "Category Summary");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(monthData), "Monthly Report");
    XLSX.writeFile(wb, `expenses_${user.username}.xlsx`);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="content-container">
        {/* Header */}
        <div className="main-header">
          <div className="user-brand">
            <h1>Expense Tracker</h1>
            <p className="user-email">{user.username}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="logout-btn" onClick={exportToExcel}>📥 Export Excel</button>
            <button className="logout-btn" onClick={() => setUser(null)}>↪ Logout</button>
          </div>
        </div>

        {/* Hero Card - Total */}
        <div className="hero-card">
          <div className="hero-label">📉 Total Expenses</div>
          <div className="total-display">₹{total.toFixed(2)}</div>
          <div className="transaction-count">{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Filters */}
        <div className="transaction-card" style={{ flexDirection: "column", alignItems: "stretch", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label>Category</label>
              <select className="input-field" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>From Date</label>
              <input className="input-field" type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input className="input-field" type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="tab-switcher" style={{ marginBottom: "20px" }}>
          <button className={activeView === "list" ? "active" : ""} onClick={() => setActiveView("list")}>📋 Transactions</button>
          <button className={activeView === "category" ? "active" : ""} onClick={() => setActiveView("category")}>📊 Category</button>
          <button className={activeView === "monthly" ? "active" : ""} onClick={() => setActiveView("monthly")}>📅 Monthly</button>
        </div>

        {/* Form */}
        {showForm && (
          <ExpenseForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}

        {/* Transaction List View */}
        {!showForm && activeView === "list" && (
          <>
            {filtered.length === 0 ? (
              <p className="empty-msg">No expenses found.</p>
            ) : (
              filtered.map((exp) => (
                <div className="transaction-card" key={exp.expenseId}>
                  <div>
                    <div className="item-main">
                      <span className="item-amount">₹{exp.amount.toFixed(2)}</span>
                      <span className="item-category">{exp.category}</span>
                    </div>
                    <div className="item-desc">{exp.description}</div>
                    <div className="item-date">
                      {new Date(exp.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="action-icon-btn" onClick={() => { setEditing(exp); setShowForm(true); }}>✏️</button>
                    <button className="action-icon-btn delete" onClick={() => handleDelete(exp.expenseId)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Category View */}
        {!showForm && activeView === "category" && (
          <>
            {categoryWise.length === 0 ? (
              <p className="empty-msg">No data.</p>
            ) : (
              <>
                {categoryWise.map(([cat, amt]) => (
                  <div className="transaction-card" key={cat}>
                    <div>
                      <span className="item-category">{cat}</span>
                      <div className="item-date" style={{ marginTop: "6px" }}>
                        {filtered.filter((e) => e.category === cat).length} transaction(s)
                      </div>
                    </div>
                    <span className="item-amount">₹{amt.toFixed(2)}</span>
                  </div>
                ))}
                <div className="hero-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "700" }}>Grand Total</span>
                  <span style={{ fontSize: "24px", fontWeight: "800" }}>₹{total.toFixed(2)}</span>
                </div>
              </>
            )}
          </>
        )}

        {/* Monthly View */}
        {!showForm && activeView === "monthly" && (
          <>
            {monthlyReport.length === 0 ? (
              <p className="empty-msg">No data.</p>
            ) : (
              <>
                {monthlyReport.map(([month, amt]) => (
                  <div className="transaction-card" key={month}>
                    <span style={{ fontWeight: "600" }}>{month}</span>
                    <span className="item-amount">₹{amt.toFixed(2)}</span>
                  </div>
                ))}
                <div className="hero-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "700" }}>Total</span>
                  <span style={{ fontSize: "24px", fontWeight: "800" }}>₹{total.toFixed(2)}</span>
                </div>
              </>
            )}
          </>
        )}

        {!showForm && (
          <button className="fab-btn" onClick={() => { setEditing(null); setShowForm(true); }}>+</button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
