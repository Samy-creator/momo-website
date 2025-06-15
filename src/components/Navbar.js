import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo192.png" alt="Logo" />
        <span>MOMOS CORNER</span>
      </div>
      <ul className="nav-links">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">About us</a>
        </li>
        <li>
          <a href="#">Contacts</a>
        </li>
      </ul>
      <button className="login-button">Login</button>
    </nav>
  );
}

export default Navbar;
