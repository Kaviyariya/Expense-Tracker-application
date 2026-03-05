import React, { useState } from "react";
import { loginUser, registerUser } from "../api";

function LoginView({ setUser }) {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      if (tab === "login") { const res = await loginUser(username, password); setUser(res.data); }
      else { await registerUser(username, password); alert("Registered successfully! Please login."); setTab("login"); }
    } catch (err) { setError(tab === "login" ? "Invalid credentials" : "Registration failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-center">
      <div className="auth-card">
        <div className="icon-box"><span style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>₹</span></div>
        <div className="auth-header"><h1>Expense Tracker</h1><p>Manage your finances with ease</p></div>
        <div className="tab-switcher">
          <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Login</button>
          <button className={tab === "signup" ? "active" : ""} onClick={() => setTab("signup")}>Sign Up</button>
        </div>
        {error && <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Username</label><input className="input-field" type="text" placeholder="your username" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
          <div className="form-group"><label>Password</label><input className="input-field" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>{loading ? "Please wait..." : tab === "login" ? "→ Login" : "→ Sign Up"}</button>
        </form>
      </div>
    </div>
  );
}

export default LoginView;
