import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./styles/Register.css";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "donor",
    location: { landmark: "", lat: "", long: "" },
  });

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
          console.log('📍 Location set:', position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Location Error:", err.message);
          toast.error("⚠️ Location access denied or failed to fetch.");
          setErrorMessage("Failed to fetch location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.location.lat || !formData.location.long) {
      toast.error("Please allow location access to complete registration.");
      setIsLoading(false);
      return;
    }

    try {
      console.log('📝 Submitting registration with formData:', formData);
      const response = await api.post(
        "http://localhost:3001/api/auth/register",
        formData
      );

      console.log('✅ Registration response:', response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setErrorMessage("");
      //alert("Registration successful! You are now logged in.");
      toast.success("Registration successful! You are now logged in.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error('❌ Registration error:', err);
      const msg = err.response?.data?.message || "Failed to register.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      {isLoading ? (
        <div className="registration-form animated-form">
          <div className="spinner"></div>
          <h2>⏳ Just a Moment!</h2>
          <p>Good things take time. Please wait while we process your registration...</p>
        </div>
      ) : (
        <div className="registration-form animated-form">
          <h1>Registration</h1>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                autoComplete="name"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                autoComplete="tel"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                autoComplete="email"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                autoComplete="current-password"
                required
              />
              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={formData.location.landmark}
                onChange={handleChange}
                className="input-field"
                autoComplete="off"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="donor">Donor</option>
                <option value="receiver">Receiver</option>
                <option value="volunteer">Volunteer</option>
              </select>
              <button type="submit" className="submit-button">
              Register
            </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
      )}
    </div>
  );
};

export default Registration;
