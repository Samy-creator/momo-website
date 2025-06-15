import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MomoHomePage from "./MomoHomePage";
import LoginPage from "./pages/loginpage";
import LoginLogs from "./loginlogs";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username") || "";
    setIsLoggedIn(storedStatus);
    setUsername(storedUsername);
  }, []);

  return (
    <Router>
      <Routes>
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
        <Route
          path="/login"
          element={
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              setUsername={setUsername}
            />
          }
        />
        <Route path="/logs" element={<LoginLogs />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
