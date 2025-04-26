// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./styles/volunteer.css";

// import VolunteerFilter from "./VolunteerFilter";

// const Volunteer = () => {
//   const [donations, setDonations] = useState([]);
//   const [acceptedDonations, setAcceptedDonations] = useState([]);
//   const [donationToAccept, setDonationToAccept] = useState(null);
//   const [donationToPickUp, setDonationToPickUp] = useState(null);

//   const [fdonations, setfDonations] = useState([]);

//   const fetchDonations = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await axios.get("http://localhost:3001/api/volunteer", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + token,
//         },
//       });

//       // If no donations, clear the previous donations
//       setDonations(response.data || []);

//       setfDonations(response.data || []);
//     } catch (error) {
//       console.error("Error fetching donations:", error.message);
//     }
//   };


//   useEffect(() => {
//     fetchDonations();
//     const intervalId = setInterval(fetchDonations,10000);
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <VolunteerFilter fdonations={fdonations} donations={setDonations} activedonations={donations} />
//       <div
//         className="vertical-line"
//         style={{
//           display: "flex",
//         }}
//       >
//         {/* Left Side: All Transactions */}
//         <div style={{ flex: 1, marginRight: "20px" }}>
//           <h2
//             style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
//           >
//             All Transactions
//           </h2>
//           {donations.length === 0 ? (
//             <p style={{ textAlign: "center", color: "red" }}>
//               No donations require a volunteer at the moment.
//             </p>
//           ) : (
//             donations.map((donation, index) => (
//               <div
//                 key={donation.donationId || index}
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "8px",
//                   padding: "15px",
//                   marginBottom: "15px",
//                   backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e9f6ff",
//                   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   {/* Donor Details */}
//                   <div style={{ flex: 1, textAlign: "center" }}>
//                     <h3 style={{ color: "#007bff" }}>Donor</h3>
//                     <p>
//                       <strong>Name:</strong> {donation.donor?.name || "Unknown"}
//                     </p>
//                     <p>
//                       <strong>Location:</strong>{" "}
//                       {donation.donor?.location
//                         ? `${donation.donor.location.landmark} (${donation.donor.location.lat}, ${donation.donor.location.long})`
//                         : "Location unavailable"}
//                     </p>
//                   </div>

//                   {/* Arrow */}
//                   <div style={{ flex: 0.2, textAlign: "center" }}>
//                     <span
//                       style={{
//                         fontSize: "24px",
//                         color: "#333",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       ➡️
//                     </span>
//                   </div>

//                   {/* Receiver Details */}
//                   <div style={{ flex: 1, textAlign: "center" }}>
//                     <h3 style={{ color: "#007bff" }}>Receiver</h3>
//                     <p>
//                       <strong>Name:</strong>{" "}
//                       {donation.receiver?.name ||
//                         "Receiver information unavailable"}
//                     </p>
//                     <p>
//                       <strong>Location:</strong>{" "}
//                       {donation.receiver?.location
//                         ? `${donation.receiver.location.landmark} (${donation.receiver.location.lat}, ${donation.receiver.location.long})`
//                         : "Location unavailable"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Accept Button */}
//                 {donation.donationDetails?.status !== "pickedByVolunteer" && (
//                   <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button
//                       onClick={() => {
//                         const donationId = donation.donationId;
//                         const acceptDonation = async (donationId) => {
//                           const token = localStorage.getItem("token");
//                           try {
//                             const response = await axios.patch(
//                               `http://localhost:3001/api/volunteer/accept/${donationId}`,
//                               {},
//                               {
//                                 headers: {
//                                   Authorization: `Bearer ${token}`,
//                                 },
//                               }
//                             );

//                             alert(response.data.message);

//                             // Update donations and move accepted donation to the accepted list
//                             setDonations((prevDonations) =>
//                               prevDonations.filter(
//                                 (donation) => donation.donationId !== donationId
//                               )
//                             );

//                             const acceptedDonation = donations.find(
//                               (donation) => donation.donationId === donationId
//                             );
//                             setAcceptedDonations((prevAccepted) => [
//                               ...prevAccepted,
//                               {
//                                 ...acceptedDonation,
//                                 status: "requestacceptedbyvolunteer",
//                               },
//                             ]);
//                           } catch (error) {
//                             console.error(
//                               "Error accepting donation:",
//                               error.message
//                             );
//                             alert(
//                               "Failed to accept donation. Please try again."
//                             );
//                           }
//                         };

//                         acceptDonation(donationId);
//                       }}
//                       style={{
//                         padding: "10px 20px",
//                         backgroundColor: "#28a745",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Accept Donation
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>

//         {/* Right Side: Accepted Donations */}
//         <div style={{ flex: 1 }}>
//           <h2
//             style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
//           >
//             Accepted Donations by Volunteer
//           </h2>
//           {acceptedDonations.length === 0 ? (
//             <p style={{ textAlign: "center", color: "blue" }}>
//               No accepted donations yet.
//             </p>
//           ) : (
//             acceptedDonations.map((donation, index) => (
//               <div
//                 key={donation.donationId || index}
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "8px",
//                   padding: "15px",
//                   marginBottom: "15px",
//                   backgroundColor: "#e9f6ff",
//                   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   {/* Donor Details */}
//                   <div style={{ flex: 1, textAlign: "center" }}>
//                     <h3 style={{ color: "#007bff" }}>Donor</h3>
//                     <p>
//                       <strong>Name:</strong> {donation.donor?.name || "Unknown"}
//                     </p>
//                     <p>
//                       <strong>Location:</strong>{" "}
//                       {donation.donor?.location
//                         ? `${donation.donor.location.landmark} (${donation.donor.location.lat}, ${donation.donor.location.long})`
//                         : "Location unavailable"}
//                     </p>
//                   </div>

//                   {/* Receiver Details */}
//                   <div style={{ flex: 1, textAlign: "center" }}>
//                     <h3 style={{ color: "#007bff" }}>Receiver</h3>
//                     <p>
//                       <strong>Name:</strong>{" "}
//                       {donation.receiver?.name ||
//                         "Receiver information unavailable"}
//                     </p>
//                     <p>
//                       <strong>Location:</strong>{" "}
//                       {donation.receiver?.location
//                         ? `${donation.receiver.location.landmark} (${donation.receiver.location.lat}, ${donation.receiver.location.long})`
//                         : "Location unavailable"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* {console.log(donation.donationId)} */}
//                 {/* Pick Up Button */}
//                 {donation.status === "requestacceptedbyvolunteer" && (
//                   <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button
//                       onClick={() => {
//                         const donationId = donation.donationId;
//                         const pickUpDonation = async (donationId) => {
//                           const token = localStorage.getItem("token");
//                           try {
//                             const response = await axios.patch(
//                               `http://localhost:3001/api/volunteer/pickedfood/${donationId}`,
//                               {},
//                               {
//                                 headers: {
//                                   "Content-Type": "application/json",
//                                   Authorization: `Bearer ${token}`,
//                                 },
//                               }
//                             );

//                             alert(response.data.message);

//                             // Update donation status to picked by volunteer
//                             setAcceptedDonations((prevDonations) =>
//                               prevDonations.map((donation) =>
//                                 donation.donationId === donationId
//                                   ? { ...donation, status: "pickedByVolunteer" }
//                                   : donation
//                               )
//                             );
//                           } catch (error) {
//                             console.error(
//                               "Error picking up donation:",
//                               error.message
//                             );
//                             alert(
//                               "Failed to pick up donation. Please try again."
//                             );
//                           }
//                         };
//                         pickUpDonation(donationId);
//                       }}
//                       style={{
//                         padding: "10px 20px",
//                         backgroundColor: "#007bff",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Pick Up Donation
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Volunteer;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./styles/volunteer.css";
// import VolunteerFilter from "./VolunteerFilter";
// import VolunteerTracking from "./VolunteerTracking"; // Import the tracking component

// const Volunteer = () => {
//   const [donations, setDonations] = useState([]);
//   const [acceptedDonations, setAcceptedDonations] = useState([]);
//   const [donationToAccept, setDonationToAccept] = useState(null);
//   const [donationToPickUp, setDonationToPickUp] = useState(null);
//   const [fdonations, setfDonations] = useState([]);
//   const [showTracking, setShowTracking] = useState(false); // State for tracking visibility
//   const [trackingDonation, setTrackingDonation] = useState(null); // State for selected donation

//   const fetchDonations = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await axios.get("http://localhost:3001/api/volunteer", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + token,
//         },
//       });

//       // If no donations, clear the previous donations
//       setDonations(response.data || []);
//       setfDonations(response.data || []);
//     } catch (error) {
//       console.error("Error fetching donations:", error.message);
//     }
//   };

//   const acceptedDonation = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const response = await axios.get("http://localhost:3001/api/volunteer/accepteddonations", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + token,
//         },
//       });

//       // If no donations, clear the previous donations
//       setDonationToAccept(response.data.donation || []);
      
//     } catch (error) {
//       console.error("Error fetching donations:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchDonations();
//     const intervalId = setInterval(fetchDonations, 10000);
//     return () => clearInterval(intervalId);
//   }, []);
//   useEffect(() => {
//     acceptedDonation();
//     const intervalId = setInterval(acceptedDonation, 10000);
//     return () => clearInterval(intervalId);
//   }, []);
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <VolunteerFilter fdonations={fdonations} donations={setDonations} activedonations={donations} />
//       <div
//         className="vertical-line"
//         style={{
//           display: "flex",
//         }}
//       >
//         {/* Left Side: All Transactions */}
//         <div style={{ flex: 1, marginRight: "20px" }}>
//           <h2
//             style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
//           >
//             All Transactions
//           </h2>
//           {donations.length === 0 ? (
//             <p style={{ textAlign: "center", color: "red" }}>
//               No donations require a volunteer at the moment.
//             </p>
//           ) : (
//             donations.map((donation, index) => (
//               <div
//                 key={donation.donationId || index}
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "8px",
//                   padding: "15px",
//                   marginBottom: "15px",
//                   backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e9f6ff",
//                   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//                 }}
//               >
//                 {/* Donor and Receiver Details */}
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <div style={{ flex: 1, textAlign: "center" }}>
//                     <h3 style={{ color: "#007bff" }}>Donor</h3>
//                     <p>
//                       <strong>Name:</strong> {donation.donor?.name || "Unknown"}
//                     </p>
//                     <p>
//                       <strong>Location:</strong>{" "}
//                       {donation.donor?.location
//                         ? `${donation.donor.location.landmark} (${donation.donor.location.lat}, ${donation.donor.location.long})`
//                         : "Location unavailable"}
//                     </p>
//                   </div>

//                   <div style={{ flex: 0.2, textAlign: "center" }}>
//                     <span
//                       style={{
//                         fontSize: "24px",
//                         color: "#333",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       ➡️
//                     </span>
//                   </div>
//                   <div style={{ flex: 1, textAlign: "center" }}>
//                     <h3 style={{ color: "#007bff" }}>Receiver</h3>
//                     <p>
//                       <strong>Name:</strong>{" "}
//                       {donation.receiver?.name ||
//                         "Receiver information unavailable"}
//                     </p>
//                     <p>
//                       <strong>Location:</strong>{" "}
//                       {donation.receiver?.location
//                         ? `${donation.receiver.location.landmark} (${donation.receiver.location.lat}, ${donation.receiver.location.long})`
//                         : "Location unavailable"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Accept Button */}
//                 {donation.donationDetails?.status !== "pickedByVolunteer" && (
//                   <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button
//                       onClick={() => {
//                         const donationId = donation.donationId;
//                         const acceptDonation = async (donationId) => {
//                           const token = localStorage.getItem("token");
//                           try {
//                             const response = await axios.patch(
//                               `http://localhost:3001/api/volunteer/accept/${donationId}`,
//                               {},
//                               {
//                                 headers: {
//                                   Authorization: `Bearer ${token}`,
//                                 },
//                               }
//                             );

//                             alert(response.data.message);

//                             // Update donations and move accepted donation to the accepted list
//                             setDonations((prevDonations) =>
//                               prevDonations.filter(
//                                 (donation) => donation.donationId !== donationId
//                               )
//                             );

//                             const acceptedDonation = donations.find(
//                               (donation) => donation.donationId === donationId
//                             );
//                             setAcceptedDonations((prevAccepted) => [
//                               ...prevAccepted,
//                               {
//                                 ...acceptedDonation,
//                                 status: "requestacceptedbyvolunteer",
//                               },
//                             ]);
//                           } catch (error) {
//                             console.error(
//                               "Error accepting donation:",
//                               error.message
//                             );
//                             alert(
//                               "Failed to accept donation. Please try again."
//                             );
//                           }
//                         };

//                         acceptDonation(donationId);
//                       }}
//                       style={{
//                         padding: "10px 20px",
//                         backgroundColor: "#28a745",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Accept Donation
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>

//         {/* Right Side: Accepted Donations */}
//         <div style={{ flex: 1 }}>
//           <h2
//             style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
//           >
//             Accepted Donations by Volunteer
//           </h2>
//           {acceptedDonations.length === 0 ? (
//             <p style={{ textAlign: "center", color: "blue" }}>
//               No accepted donations yet.
//             </p>
//           ) : (
//             acceptedDonations.map((donation, index) => (
//               <div
//                 key={donation.donationId || index}
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "8px",
//                   padding: "15px",
//                   marginBottom: "15px",
//                   backgroundColor: "#e9f6ff",
//                   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
                  
//                   <div style={{ flex: 1, textAlign: "center" }}>
//                     <h3 style={{ color: "#007bff" }}>Donor</h3>
//                     <p>
//                       <strong>Name:</strong> {donation.donor?.name || "Unknown"}
//                     </p>
//                     <p>
//                       <strong>Location:</strong>{" "}
//                       {donation.donor?.location
//                         ? `${donation.donor.location.landmark} (${donation.donor.location.lat}, ${donation.donor.location.long})`
//                         : "Location unavailable"}
//                     </p>
//                   </div>

//                   {/* Receiver Details */}
//                   <div style={{ flex: 1, textAlign: "center" }}>
//                     <h3 style={{ color: "#007bff" }}>Receiver</h3>
//                     <p>
//                       <strong>Name:</strong>{" "}
//                       {donation.receiver?.name ||
//                         "Receiver information unavailable"}
//                     </p>
//                     <p>
//                       <strong>Location:</strong>{" "}
//                       {donation.receiver?.location
//                         ? `${donation.receiver.location.landmark} (${donation.receiver.location.lat}, ${donation.receiver.location.long})`
//                         : "Location unavailable"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Pick Up Button */}
//                 {donationToAccept.status === "requestacceptedbyvolunteer" && (
//                   <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button
//                       onClick={() => {
//                         const donationId = donation.donationId;
//                         const pickUpDonation = async (donationId) => {
//                           const token = localStorage.getItem("token");
//                           try {
//                             const response = await axios.patch(
//                               `http://localhost:3001/api/volunteer/pickedfood/${donationId}`,
//                               {},
//                               {
//                                 headers: {
//                                   "Content-Type": "application/json",
//                                   Authorization: `Bearer ${token}`,
//                                 },
//                               }
//                             );

//                             alert(response.data.message);

//                             // Update donation status to picked by volunteer
//                             setAcceptedDonations((prevDonations) =>
//                               prevDonations.map((donation) =>
//                                 donation.donationId === donationId
//                                   ? { ...donation, status: "pickedByVolunteer" }
//                                   : donation
//                               )
//                             );
//                           } catch (error) {
//                             console.error(
//                               "Error picking up donation:",
//                               error.message
//                             );
//                             alert(
//                               "Failed to pick up donation. Please try again."
//                             );
//                           }
//                         };
//                         pickUpDonation(donationId);
//                       }}
//                       style={{
//                         padding: "10px 20px",
//                         backgroundColor: "#007bff",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Pick Up Donation
//                     </button>

//                     {/* Track Volunteer Button */}
//                     <button
//                       onClick={() => {
//                         setTrackingDonation(donation);
//                         setShowTracking(true);
//                       }}
//                       style={{
//                         padding: "10px 20px",
//                         backgroundColor: "#28a745",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                         marginLeft: "10px",
//                       }}
//                     >
//                       Track Volunteer
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Render VolunteerTracking Component */}
//       {showTracking && trackingDonation && (
//         <VolunteerTracking
//           donor={trackingDonation.donor.location}
//           receiver={trackingDonation.receiver.location}
//         />
//       )}
//     </div>
//   );
// };

// export default Volunteer;






import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/volunteer.css";
import VolunteerFilter from "./VolunteerFilter";
import VolunteerTracking from "./VolunteerTracking"; // Import the tracking component

const Volunteer = () => {
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [donationToAccept, setDonationToAccept] = useState(null);
  const [donationToPickUp, setDonationToPickUp] = useState(null);
  const [fdonations, setfDonations] = useState([]);
  const [showTracking, setShowTracking] = useState(false); // State for tracking visibility
  const [trackingDonation, setTrackingDonation] = useState(null); // State for selected donation

  const fetchDonations = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3001/api/volunteer", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      // If no donations, clear the previous donations
      setDonations(response.data || []);
      setfDonations(response.data || []);
    } catch (error) {
      console.error("Error fetching donations:", error.message);
    }
  };

  useEffect(() => {
    fetchDonations();
    const intervalId = setInterval(fetchDonations, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <VolunteerFilter fdonations={fdonations} donations={setDonations} activedonations={donations} />
      <div
        className="vertical-line"
        style={{
          display: "flex",
        }}
      >
        {/* Left Side: All Transactions */}
        <div style={{ flex: 1, marginRight: "20px" }}>
          <h2
            style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
          >
            All Transactions
          </h2>
          {donations.length === 0 ? (
            <p style={{ textAlign: "center", color: "red" }}>
              No donations require a volunteer at the moment.
            </p>
          ) : (
            donations.map((donation, index) => (
              <div
                key={donation.donationId || index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e9f6ff",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Donor and Receiver Details */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <h3 style={{ color: "#007bff" }}>Donor</h3>
                    <p>
                      <strong>Name:</strong> {donation.donor?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {donation.donor?.location
                        ? `${donation.donor.location.landmark} (${donation.donor.location.lat}, ${donation.donor.location.long})`
                        : "Location unavailable"}
                    </p>
                  </div>
                  <div style={{ flex: 0.2, textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "24px",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                    >
                      ➡️
                    </span>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <h3 style={{ color: "#007bff" }}>Receiver</h3>
                    <p>
                      <strong>Name:</strong>{" "}
                      {donation.receiver?.name ||
                        "Receiver information unavailable"}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {donation.receiver?.location
                        ? `${donation.receiver.location.landmark} (${donation.receiver.location.lat}, ${donation.receiver.location.long})`
                        : "Location unavailable"}
                    </p>
                  </div>
                </div>

                {/* Accept Button */}
                {donation.donationDetails?.status !== "pickedByVolunteer" && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                      onClick={() => {
                        const donationId = donation.donationId;
                        const acceptDonation = async (donationId) => {
                          const token = localStorage.getItem("token");
                          try {
                            const response = await axios.patch(
                              `http://localhost:3001/api/volunteer/accept/${donationId}`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );

                            alert(response.data.message);

                            // Update donations and move accepted donation to the accepted list
                            setDonations((prevDonations) =>
                              prevDonations.filter(
                                (donation) => donation.donationId !== donationId
                              )
                            );

                            const acceptedDonation = donations.find(
                              (donation) => donation.donationId === donationId
                            );
                            setAcceptedDonations((prevAccepted) => [
                              ...prevAccepted,
                              {
                                ...acceptedDonation,
                                status: "requestacceptedbyvolunteer",
                              },
                            ]);
                          } catch (error) {
                            console.error(
                              "Error accepting donation:",
                              error.message
                            );
                            alert(
                              "Failed to accept donation. Please try again."
                            );
                          }
                        };

                        acceptDonation(donationId);
                      }}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Accept Donation
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Side: Accepted Donations */}
        <div style={{ flex: 1 }}>
          <h2
            style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
          >
            Accepted Donations by Volunteer
          </h2>
          {acceptedDonations.length === 0 ? (
            <p style={{ textAlign: "center", color: "blue" }}>
              No accepted donations yet.
            </p>
          ) : (
            acceptedDonations.map((donation, index) => (
              <div
                key={donation.donationId || index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: "#e9f6ff",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* Donor Details */}
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <h3 style={{ color: "#007bff" }}>Donor</h3>
                    <p>
                      <strong>Name:</strong> {donation.donor?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {donation.donor?.location
                        ? `${donation.donor.location.landmark} (${donation.donor.location.lat}, ${donation.donor.location.long})`
                        : "Location unavailable"}
                    </p>
                  </div>

                  {/* Receiver Details */}
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <h3 style={{ color: "#007bff" }}>Receiver</h3>
                    <p>
                      <strong>Name:</strong>{" "}
                      {donation.receiver?.name ||
                        "Receiver information unavailable"}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {donation.receiver?.location
                        ? `${donation.receiver.location.landmark} (${donation.receiver.location.lat}, ${donation.receiver.location.long})`
                        : "Location unavailable"}
                    </p>
                  </div>
                </div>

                {/* Pick Up Button */}
                {donation.status === "requestacceptedbyvolunteer" && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                      onClick={() => {
                        const donationId = donation.donationId;
                        const pickUpDonation = async (donationId) => {
                          const token = localStorage.getItem("token");
                          try {
                            const response = await axios.patch(
                              `http://localhost:3001/api/volunteer/pickedfood/${donationId}`,
                              {},
                              {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );

                            alert(response.data.message);

                            // Update donation status to picked by volunteer
                            setAcceptedDonations((prevDonations) =>
                              prevDonations.map((donation) =>
                                donation.donationId === donationId
                                  ? { ...donation, status: "pickedByVolunteer" }
                                  : donation
                              )
                            );
                          } catch (error) {
                            console.error(
                              "Error picking up donation:",
                              error.message
                            );
                            alert(
                              "Failed to pick up donation. Please try again."
                            );
                          }
                        };
                        pickUpDonation(donationId);
                      }}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Pick Up Donation
                    </button>

                    {/* Track Volunteer Button */}
                    <button
                      onClick={() => {
                        setTrackingDonation(donation);
                        console.log("tracked button clicked",donation)
                        setShowTracking(true);
                      }}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      Track Volunteer
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Render VolunteerTracking Component */}
      {showTracking && trackingDonation && (
        <VolunteerTracking
          donor={trackingDonation.donor.location}
          receiver={trackingDonation.receiver.location}
        />
      )}
    </div>
  );
};

export default Volunteer;