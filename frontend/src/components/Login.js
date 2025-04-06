// /src/components/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const { login, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // States for email login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // States for epunjab login
  const [epunjabid, setEpunjabid] = useState("");
  const [epunjabPassword, setEpunjabPassword] = useState("");

  const [error, setError] = useState("");
  const [useEpunjabLogin, setUseEpunjabLogin] = useState(false);

  // Handler for email login (unchanged)
  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  // Handler for epunjab login
  const handleEpunjabLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/api/users/login/epunjab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ epunjabid, password: epunjabPassword })
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const userData = await response.json();
      // Set the logged in user in AuthContext so that the user is properly identified
      setUser(userData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      {!useEpunjabLogin ? (
        <form onSubmit={handleEmailLoginSubmit} className="login-form">
          <h2>Login with Email</h2>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
          <button
            type="button"
            className="toggle-login-btn"
            onClick={() => {
              setError("");
              setUseEpunjabLogin(true);
            }}
          >
            Or Login with epunjabid
          </button>
        </form>
      ) : (
        <form onSubmit={handleEpunjabLoginSubmit} className="login-form">
          <h2>Login with epunjab Id</h2>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label>epunjab Id:</label>
            <input
              type="number"
              value={epunjabid}
              placeholder="Enter your epunjabid"
              onChange={(e) => setEpunjabid(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={epunjabPassword}
              placeholder="Enter your password"
              onChange={(e) => setEpunjabPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
          <button
            type="button"
            className="toggle-login-btn"
            onClick={() => {
              setError("");
              setUseEpunjabLogin(false);
            }}
          >
            Or Login with Email
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
