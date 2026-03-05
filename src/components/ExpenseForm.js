import React, { useState, useEffect } from "react";

const CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"];

function ExpenseForm({ initial, onSave, onCancel }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (initial) { setAmount(String(initial.amount)); setCategory(initial.category); setDescription(initial.description); setDate(initial.date); }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return alert("Fill all fields");
    onSave({ amount: parseFloat(amount), category, description, date });
  };

  return (
    <form className="transaction-card" onSubmit={handleSubmit} style={{ flexDirection: "column", alignItems: "stretch" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group"><label>Amount</label><input className="input-field" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
        <div className="form-group"><label>Category</label><select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
      </div>
      <div className="form-group"><label>Description</label><input className="input-field" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
      <div className="form-group"><label>Date</label><input className="input-field" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <button className="save-btn" type="submit">✓ Save</button>
        <button className="cancel-btn" type="button" onClick={onCancel}>✕ Cancel</button>
      </div>
    </form>
  );
}

export default ExpenseForm;
