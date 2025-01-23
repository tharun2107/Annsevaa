import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Login.css";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;  

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

   
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleBackspace = (value, index) => {
    if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/send-otp", { phone });
      setIsOtpSent(true);
      setErrorMessage("");
      toast.success("OTP sent to your phone");
    } catch (error) {
      setErrorMessage("Failed to send OTP. Please try again.");
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const verifyAndLogin = async () => {
    try {
      const otpString = otp.join("");
      const response = await axios.post("http://localhost:3001/api/auth/verify-otp", { phone, otp: otpString });

       if(response.status === 200){
        const response  = await axios.post("http://localhost:3001/api/auth/login",{phone})
        if(response.status === 200){
          const redirectionUrl = response.data.redirectUrl;
      console.log(response.data);
       console.log(redirectionUrl)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login successful");
      navigate(redirectionUrl);
          }
         else if(response.status === 404){
          setErrorMessage("User not found");
         }
         
        }
        else{
          setErrorMessage(response.data.message);
        }
       
      
    } catch (error) {
      setErrorMessage("Failed to login. Please check the OTP and try again.");
      toast.error("Failed to login. Please check the OTP and try again.");
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

        {isOtpSent ? (
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => e.key === "Backspace" && handleBackspace(e.target.value, index)}
                className="otp-input"
              />
            ))}
          </div>
        ) : (
          <button onClick={sendOtp} className="submit-button">
            Send OTP
          </button>
        )}

        {isOtpSent && (
          <button onClick={verifyAndLogin} className="submit-button">
            Verify & Login
          </button>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
