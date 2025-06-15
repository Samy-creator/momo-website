import React, { useEffect, useState } from "react";
import "./loginlogs.css";

const LoginLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logins");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError("Failed to load login logs");
      console.error(err);
    }
  };

  const clearLogs = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to delete all logs?"
    );
    if (!confirmClear) return;

    try {
      const res = await fetch("http://localhost:5000/api/logins", {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Logs cleared successfully.");
        fetchLogs();
      } else {
        alert("Failed to clear logs.");
      }
    } catch (err) {
      alert("Error clearing logs.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs =
    filter === "all" ? logs : logs.filter((log) => log.status === filter);

  return (
    <div className="logs-wrap">
      <h2>Login Logs</h2>

      <div className="log-controls">
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="fail">Fail</option>
        </select>

        <button className="clear-btn" onClick={clearLogs}>
          Clear Logs
        </button>
      </div>

      {error && <p className="log-error">{error}</p>}
      <table className="logs-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan="4">No logs found.</td>
            </tr>
          ) : (
            filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.username}</td>
                <td>{log.status}</td>
                <td>{log.reason}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoginLogs;
