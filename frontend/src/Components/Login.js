
// import axios from "axios";
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// // import "./styles/Login.css"; // Assuming you store the CSS in Auth.css

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpSuccessMessage, setOtpSuccessMessage] = useState("");
//   const [isSendingOtp, setIsSendingOtp] = useState(false);

//   const handleSendOtp = async () => {
//     setIsSendingOtp(true);
//     try {
//       console.log("Sending OTP to email:", email);
//       const response = await axios.post("http://localhost:3001/api/otp", {
//         email,
//       });
//       console.log("OTP sent response:", response);
//       setOtpSent(true);
//       setOtpSuccessMessage("OTP has been sent to your email.");
//       setIsSendingOtp(false);
//     } catch (error) {
//       setIsSendingOtp(false);
//       console.error("Error sending OTP:", error);
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data.message || "An error occurred.");
//       } else {
//         setErrorMessage("Something went wrong. Please try again.");
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("Verifying OTP:", otp);
//       await axios.post("http://localhost:3001/api/otpVerify", {
//         email,
//         otp,
//       });
//       console.log("OTP Verified successfully.");
//       toast.success("Login successful.");

//       const response = await axios.post("http://localhost:3001/api/auth/login", {
//         email,
//       });
//       console.log("Login response:", response);

//       if (response.status !== 200) {
//         console.log("Response status:", response.status);
//       } else {
//         console.log("Response data:", response.data);
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         if (response.data.user.isAdmin) {
//           window.location.href = "/admin";
//         } else {
//           window.location.href = "/user-type-selection";
//         }
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data.message || "An error occurred.");
//       } else {
//         setErrorMessage("Something went wrong. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="login-form-container">
//       {!otpSent ? (
//         <>
//           {isSendingOtp ? (
//             <div className="loading-message">
//               <div className="spinner"></div>
//               <h2>⏳ Just a Moment!</h2>
//               <p>Your OTP is on its way...</p>
//               <button
//                 className="refresh-button"
//                 onClick={() => window.location.reload()}
//               >
//                 Refresh
//               </button>
//             </div>
//           ) : (
//             <form className="login-form" onSubmit={handleSubmit}>
//               <h2>Login</h2>
//               <div className="input-otp">
//                 <input
//                   placeholder="Enter your Email..."
//                   type="email"
//                   name="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <button type="button" onClick={handleSendOtp}>
//                   Send OTP
//                 </button>
//               </div>
//               <br />
//               {otpSent && (
//                 <>
//                   <label>
//                     OTP:
//                     <input
//                       type="text"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value)}
//                       required
//                     />
//                   </label>
//                   <p style={{ color: "green" }}>{otpSuccessMessage}</p>
//                 </>
//               )}
//               <button type="submit">Login</button>
//             </form>
//           )}
//         </>
//       ) : (
//         <form className="login-form" onSubmit={handleSubmit}>
//           <h2>Login</h2>
//           <label>
//             OTP:
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//             />
//           </label>
//           <button type="submit">Login</button>
//         </form>
//       )}
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default Login;


// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Login.css"; // Add this CSS file for styling

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", { phone });
      console.log(response);
      await axios.post("http://localhost:3001/api/auth/send-otp", { phone });
      setIsOtpSent(true);
      setErrorMessage("");
      alert("OTP sent to your phone");
    } catch (error) {
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };
  // const sendOtp = async () => {
  //   try {
  //     // Check if the user exists using the login endpoint
  //     const response = await axios.post("http://localhost:3001/api/auth/login", { phone });
  //     console.log(response);
  
  //     // Check if the response status is 200
  //     if (response.status === 200) {
  //       // User exists, send OTP
  //       await axios.post("http://localhost:3001/api/auth/sent-otp", { phone });
  //       setIsOtpSent(true);
  //       setErrorMessage("");
  //       alert("OTP sent to your phone");
  //     }
  //   } catch (error) {
  //     if (error.response?.status === 404) {
  //       setErrorMessage("User not found. Please register first.");
  //     } else {
  //       setErrorMessage("Failed to send OTP. Please try again.");
  //     }
  //   }
  // };
  
  
  const verifyAndLogin = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/verify-otp", { phone, otp });
      const response = await axios.post("http://localhost:3001/api/auth/login", { phone });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setErrorMessage("");
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Failed to login. Please check the OTP and try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />

        {isOtpSent ? (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field"
            />
            <button onClick={verifyAndLogin} className="submit-button">
              Verify & Login
            </button>
          </>
        ) : (
          <button onClick={sendOtp} className="submit-button">
            Send OTP
          </button>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
