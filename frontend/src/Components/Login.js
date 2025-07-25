import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Login.css";
import api from "../api/axios"
const Login = () => {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("http://localhost:3001/api/auth/login", { phone });
      if (response.status === 200) {
        const redirectionUrl = response.data.redirectUrl;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successful");
        navigate(redirectionUrl);
      } else if (response.status === 404) {
        setErrorMessage("User not found");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("Failed to login. Please try again.");
      toast.error("Failed to login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-form animated-form">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />
        <button onClick={handleLogin} className="submit-button">
          Login
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
