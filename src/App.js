import React, { useState } from "react";
import LoginView from "./components/LoginView";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="app">
      {user ? <Dashboard user={user} setUser={setUser} /> : <LoginView setUser={setUser} />}
    </div>
  );
}

export default App;
