import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Login.css";
import api from "../api/axios";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("https://annsevaa.onrender.com/api/auth/login", {
        phone,
        password,
      });

      if (response.status === 200) {
        const redirectionUrl = response.data.redirectUrl || "/";
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("✅ Login successful");
        setTimeout(() => {
          navigate('/');
        }, 1000); // Wait for toast to show
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to login. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-form animated-form">
        <h1>Login</h1>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
          autoComplete="tel"
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          autoComplete="current-password"
          required
        />
        <button
          onClick={handleLogin}
          className="submit-button"
          disabled={isLoading || !phone || !password}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
