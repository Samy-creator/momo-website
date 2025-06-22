import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MomoHomePage from "./MomoHomePage";
import LoginPage from "./pages/loginpage";
import LoginLogs from "./loginlogs"; // Assuming this path is correct
import AdminHomepageEditor from "./components/admin/AdminHomepageEditor"; // Import the Admin Homepage Editor

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Initialize login status and username from localStorage on app load
  useEffect(() => {
    const storedStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username") || "";
    setIsLoggedIn(storedStatus);
    setUsername(storedUsername);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route for the main public homepage */}
        <Route
          path="/"
          element={
            <MomoHomePage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
            />
          }
        />
        {/* Route for the login page */}
        <Route
          path="/login"
          element={
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              setUsername={setUsername}
            />
          }
        />
        {/* Route for login logs (your existing component) */}
        <Route path="/logs" element={<LoginLogs />} />
        {/* NEW: Route for the Admin Homepage Editor */}
        <Route path="/adminpage" element={<AdminHomepageEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
