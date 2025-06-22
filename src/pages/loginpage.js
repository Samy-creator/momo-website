import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

const Loginpage = ({ setIsLoggedIn, setUsername }) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // IMPORTANT: New useEffect to handle redirection if ALREADY logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (token) {
      console.log(
        "Loginpage useEffect: Token found in localStorage. Clearing and redirecting to force re-login."
      );
      // If a token exists, even if invalid, clear it to ensure a fresh login
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");
      // Update parent component state to reflect logout
      setIsLoggedIn(false);
      setUsername("");

      // Redirect immediately to prevent displaying the login form briefly
      // Decide where to redirect based on what makes sense after a forced logout.
      // For now, let's redirect to the base login path itself, which will then allow the user to properly log in.
      // Or if you want them always on homepage after clearing, use navigate('/');
      navigate("/login"); // Redirect back to login, forcing fresh input
    }
  }, [navigate, setIsLoggedIn, setUsername]); // Add setIsLoggedIn, setUsername to dependencies

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!usernameInput.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store new login details
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");

        // Update app state
        setIsLoggedIn(true);
        setUsername(data.username);

        setSuccessMessage(`Welcome, ${data.username}!`);

        // Redirect based on admin status
        if (data.isAdmin) {
          navigate("/adminpage");
        } else {
          navigate("/");
        }
      } else {
        setErrorMessage(
          data.error || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login request error:", err);
      if (err instanceof SyntaxError) {
        setErrorMessage("Unexpected response from server. Please try again.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
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
            aria-label="Username"
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          {errorMessage && <p className="login-error">{errorMessage}</p>}
          {successMessage && <p className="login-success">{successMessage}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <p className="login-link">
          New user? <a href="/register">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
