import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

const Loginpage = ({ setIsLoggedIn, setUsername }) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!usernameInput.trim() || !password.trim()) {
      return setError("Please enter both username and password");
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save login details
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("hasWelcomed", "true");

        // Update app state
        setIsLoggedIn(true);
        setUsername(data.username);

        alert(`Welcome, ${data.username}!`);
        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <p className="login-link">
          New user? <a href="#">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
