import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// REMOVE THIS LINE if it exists: import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* REMOVE <BrowserRouter> tags if they wrap <App /> here */}
    <App />
    {/* REMOVE </BrowserRouter> if it exists */}
  </React.StrictMode>
);
