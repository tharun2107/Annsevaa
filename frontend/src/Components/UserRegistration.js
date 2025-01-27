
import React, { useEffect, useState } from "react";
import { resolvePath, useNavigate } from "react-router-dom";
import "./styles/Register.css";
import api from "../api/axios";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "donor",
    location: { landmark: "", lat: "", long: "" },
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              long: position.coords.longitude,
            },
          }));
        },
        () => setErrorMessage("Failed to fetch location.")
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "landmark") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, landmark: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      console.log("Sending OTP with data:", formData);
      await api.post("http://localhost:3001/api/auth/send-otp", {
        phone: formData.phone,
      });
      setIsOtpSent(true);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndRegister = async () => {
    try {
      await api.post("http://localhost:3001/api/auth/verify-otp", {
        phone: formData.phone,
        otp,
      });

      const response = await api.post(
        "http://localhost:3001/api/auth/register",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setErrorMessage("");
      const redirectUrl = response.data.redirectUrl;
      navigate(redirectUrl);
    } catch (err) {
      setErrorMessage(err.response?.data?.msg || "Failed to register.");
    }
  };

  return (
    <div className="registration-container">
      {isLoading ? (
        <div className="registration-form">
          <div className="spinner"></div>
          <h2>⏳ Just a Moment!</h2>
          <p>
            Good things take time. Your OTP is on its way and will arrive
            shortly...
          </p>
        </div>
      ) : (
        <div className="registration-form">
          <h1>Registration</h1>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            value={formData.location.landmark}
            onChange={handleChange}
            className="input-field"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="donor">Donor</option>
            <option value="receiver">Receiver</option>
            <option value="volunteer">Volunteer</option>
          </select>

          {isOtpSent ? (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field"
              />
              <button onClick={verifyAndRegister} className="submit-button">
                Verify & Register
              </button>
            </>
          ) : (
            <button onClick={sendOtp} className="submit-button">
              Send OTP
            </button>
          )}

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Registration;
