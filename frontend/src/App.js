// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [otp, setOtp] = useState('');
//     const [isOtpSent, setIsOtpSent] = useState(false);

//     const handleSendOtp = async () => {
//       try {
//           console.log(phoneNumber);
//             const response = await axios.post('http://localhost:3001/send-otp', { phoneNumber });
//             console.log(response.data);
//             setIsOtpSent(true);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleVerifyOtp = async () => {
//         try {
//             const response = await axios.post('http://localhost:3001/verify-otp', { phoneNumber, otp });
//             console.log(response.data);
//             alert('OTP verified successfully!');
//         } catch (error) {
//             console.error(error);
//             alert('Invalid OTP');
//         }
//     };

//     return (
//         <div className="App">
//             <h1>OTP Authentication</h1>
//             {!isOtpSent ? (
//                 <div>
//                     <input
//                         type="text"
//                         placeholder="Enter Phone Number"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                     />
//                     <button onClick={handleSendOtp}>Send OTP</button>
//                 </div>
//             ) : (
//                 <div>
//                     <input
//                         type="text"
//                         placeholder="Enter OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                     />
//                     <button onClick={handleVerifyOtp}>Verify OTP</button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default App;


import UserRegistration from './Components/UserRegistration';
import Login from './Components/Login';
import Home from './Components/Home';
import Donor from './Components/Donor';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import {Receiver} from './Components/Receiver';
import Volunteer from './Components/Volunteer';
import { DonorHistory } from './Components/DonarHistory';
import { ReceiverHistory } from './Components/ReceiverHistory';
import { VolunteerHistory } from './Components/VolunteerHistory';
import AdminDashboard from "./Components/AdminDashboard"
import  Contact from "./Components/Contact"
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/contactus" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegistration />} />
          {/* <Route path="/dashboard" element={<div>Dashboard</div>} /> */}
          <Route path="/receiver" element={<Receiver />} />
          <Route path="/donor" element={<Donor/>} />
          <Route path="/volunteer" element={<Volunteer/>} />
           <Route path="/donor/history" element={<DonorHistory />} />
          <Route path="/receiver/history" element={<ReceiverHistory />} />
          <Route path="/volunteer/history" element={<VolunteerHistory />} />
        </Routes>
        <ToastContainer /> {/* Add ToastContainer here */}
      </div>
    </BrowserRouter>
  );
}

export default App;
