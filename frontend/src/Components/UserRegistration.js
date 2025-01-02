// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./styles/Register.css";

// const Registration = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     role: "donor", // Default role is donor
//     f: { landmark: "", lat: "", long: "" }, // Add default location object
//   });
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   // Function to get the user's location
//   const getLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const lat = position.coords.latitude;
//         const long = position.coords.longitude;
//         setFormData((prevData) => ({
//           ...prevData,
//           location: { ...prevData.location, lat, long },
//         }));
//       }, (error) => {
//         setErrorMessage("Location access denied.");
//       });
//     } else {
//       setErrorMessage("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     getLocation(); // Get location when the component mounts
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const sendOtp = async () => {
//     try {
//       console.log(formData);
//       await axios.post("http://localhost:3001/api/auth/sent-otp", { phone: formData.phone });
//       setIsOtpSent(true);
//       setErrorMessage("");
//     } catch (error) {
//       setErrorMessage("Failed to send OTP");
//     }
//   };

//   const verifyAndRegister = async () => {
//     try {
//       if (!formData.role) {
//         formData.role = "donor"; // Set to default if no role is selected
//       }

//       await axios.post("http://localhost:3001/api/auth/verify-otp", {
//         phone: formData.phone,
//         otp,
//       });
//       console.log("otp verirfied");
//       console.log(formData);
//       const response = await axios.post("http://localhost:3001/api/auth/register", formData);
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//       setErrorMessage("");
//       navigate("/dashboard");
//     } catch (error) {
//       setErrorMessage(error.response?.data?.msg || "Failed to register");
//     }
//   };

//   return (
//     <div className="registration-container">
//       <h1>Registration</h1>
//       <input
//         type="text"
//         name="name"
//         placeholder="Name"
//         value={formData.name}
//         onChange={handleChange}
//         className="input-field"
//       />
//       <input
//         type="text"
//         name="phone"
//         placeholder="Phone"
//         value={formData.phone}
//         onChange={handleChange}
//         className="input-field"
//       />
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={handleChange}
//         className="input-field"
//       />
//       <input
//   type="text"
//   name="landmark"
//   placeholder="Landmark"
//   value={formData.location.landmark}
//   onChange={(e) =>
//     setFormData((prevData) => ({
//       ...prevData,
//       location: { ...prevData.location, landmark: e.target.value },
//     }))
//   }
//   className="input-field"
// />

//       <select
//         name="role"
//         value={formData.role}
//         onChange={handleChange}
//         className="input-field"
//       >
//         <option value="">Select Role</option>
//         <option value="donor">Donor</option>
//         <option value="receiver">Receiver</option>
//         <option value="volunteer">Volunteer</option>
//       </select>

//       {isOtpSent ? (
//         <>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="input-field"
//           />
//           <button onClick={verifyAndRegister} className="submit-button">
//             Verify & Register
//           </button>
//         </>
//       ) : (
//         <button onClick={sendOtp} className="submit-button">
//           Submit
//         </button>
//       )}

//       {errorMessage && <p className="error-message">{errorMessage}</p>}
//     </div>
//   );
// };

// export default Registration;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Register.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "donor", // Default role is donor
    location: { landmark: "", lat: "", long: "" }, // Correct key for location
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Function to get the user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          setFormData((prevData) => ({
            ...prevData,
            location: { ...prevData.location, lat, long },
          }));
        },
        (error) => {
          setErrorMessage("Location access denied.");
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation(); // Get location when the component mounts
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "landmark") {
      setFormData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, landmark: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const sendOtp = async () => {
    try {
      console.log(formData)
      await axios.post("http://localhost:3001/api/auth/send-otp", {
        phone: formData.phone,
      });
      setIsOtpSent(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to send OTP");
    }
  };

  const verifyAndRegister = async () => {
    try {
      if (!formData.role) {
        formData.role = "donor"; // Set to default if no role is selected
      }

      await axios.post("http://localhost:3001/api/auth/verify-otp", {
        phone: formData.phone,
        otp,
      });

      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setErrorMessage("");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Failed to register");
    }
  };

  return (
    <div className="registration-container">
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
        <option value="">Select Role</option>
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
          Submit
        </button>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Registration;
