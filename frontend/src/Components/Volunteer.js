// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Volunteer = () => {
//   const [donations, setDonations] = useState([]);

//   useEffect(() => {
//     // Fetch donations periodically
//     const fetchDonations = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await axios.get("http://localhost:3001/api/volunteer", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//         });

//         // If no donations, clear the previous donations
//         if (response.data.length === 0) {
//           setDonations([]);
//         } else {
//           setDonations(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching donations:", error.message);
//       }
//     };

//     // Initial fetch
//     fetchDonations();

//     // Set interval to fetch donations every 10 seconds (adjust the time as needed)
//     const intervalId = setInterval(fetchDonations, 10000);

//     // Clean up interval on component unmount
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);

//   const acceptDonation = async (donationId) => {
//     const token = localStorage.getItem("token");
//     console.log(donationId);
//     if (!donationId) {
//       alert("Invalid donation ID.");
//       return;
//     }
//     try {
//       const response = await axios.patch(
//         `http://localhost:3001/api/donation/volunteer/accept/${donationId}`,
//         {}, // Empty body
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//         }
//       );
//       console.log(donationId);
//       alert(response.data.message); // Show success message
//       setDonations((prevDonations) =>
//         prevDonations.map((donation) =>
//           donation._id === donationId // Match with MongoDB `_id`
//             ? { ...donation, status: "pickedByVolunteer" }
//             : donation
//         )
//       ); // Update the status in the UI
//     } catch (error) {
//       console.error("Error accepting donation:", error.message);
//       alert("Failed to accept donation. Please try again.");
//     }
//   };
  
//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
//         Volunteer Assignments
//       </h2>
//       {donations.length === 0 ? (
//         <p style={{ textAlign: "center", color: "red" }}>
//           No donations require a volunteer at the moment.
//         </p>
//       ) : (
//         donations.map((donation, index) => (
//           <div
//             key={donation.donationId || index}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "8px",
//               padding: "15px",
//               marginBottom: "15px",
//               backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e9f6ff",
//               boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center" }}>
//               {/* Donor Details */}
//               <div style={{ flex: 1, textAlign: "center" }}>
//                 <h3 style={{ color: "#007bff" }}>Donor</h3>
//                 <p>
//                   <strong>Name:</strong> {donation.donor?.name || "Unknown"}
//                 </p>
//                 <p>
//                   <strong>Location:</strong>{" "}
//                   {donation.donor?.location
//                     ? `${donation.donor.location.landmark} (${donation.donor.location.lat}, ${donation.donor.location.long})`
//                     : "Location unavailable"}
//                 </p>
//               </div>

//               {/* Arrow */}
//               <div style={{ flex: 0.2, textAlign: "center" }}>
//                 <span
//                   style={{
//                     fontSize: "24px",
//                     color: "#333",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   ➡️
//                 </span>
//               </div>

//               {/* Receiver Details */}
//               <div style={{ flex: 1, textAlign: "center" }}>
//                 <h3 style={{ color: "#007bff" }}>Receiver</h3>
//                 <p>
//                   <strong>Name:</strong>{" "}
//                   {donation.receiver?.name || "Receiver information unavailable"}
//                 </p>
//                 <p>
//                   <strong>Location:</strong>{" "}
//                   {donation.receiver?.location
//                     ? `${donation.receiver.location.landmark} (${donation.receiver.location.lat}, ${donation.receiver.location.long})`
//                     : "Location unavailable"}
//                 </p>
//               </div>
//             </div>

//             {/* Additional Donation Details */}
//             <div style={{ marginTop: "20px" }}>
//               <p>
//                 <strong>Quantity:</strong>{" "}
//                 {donation.donationDetails?.quantity || "Unknown"}
//               </p>
//               <p>
//                 <strong>Shelf Life:</strong>{" "}
//                 {donation.donationDetails?.shelfLife || "Unknown"} days
//               </p>
//               <p>
//                 <strong>Donation Location:</strong>{" "}
//                 {donation.donationDetails?.location
//                   ? `${donation.donationDetails.location.landmark} (${donation.donationDetails.location.lat}, ${donation.donationDetails.location.long})`
//                   : "Location unavailable"}
//               </p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 {donation.donationDetails?.status || "Unknown"}
//               </p>
//               {donation.donationDetails?.pictureUrl && (
//                 <img
//                   src={donation.donationDetails.pictureUrl}
//                   alt="Donation"
//                   style={{
//                     maxWidth: "100%",
//                     marginTop: "10px",
//                     borderRadius: "5px",
//                   }}
//                 />
//               )}
//             </div>

//             {/* Accept Button */}
//             {donation.donationDetails?.status !== "pickedByVolunteer" && (
//               <div style={{ textAlign: "center", marginTop: "20px" }}>
//                 <button
//                   onClick={() => acceptDonation(donation.donationId)}
//                   style={{
//                     padding: "10px 20px",
//                     backgroundColor: "#28a745",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Accept Donation
//                 </button>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Volunteer;


import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/volunteer.css"
const Volunteer = () => {
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);

  useEffect(() => {
    // Fetch donations periodically
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
      } catch (error) {
        console.error("Error fetching donations:", error.message);
      }
    };

    // Initial fetch
    fetchDonations();

    // Set interval to fetch donations every 10 seconds (adjust the time as needed)
    const intervalId = setInterval(fetchDonations, 10000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const acceptDonation = async (donationId) => {
    const token = localStorage.getItem("token");
    console.log(token)
    console.log(donationId)
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/volunteer/accept/${donationId}`,
        {
          headers: {
          Authorization: `Bearer ${token}`,
          },
        }
      );
     console.log(response.data)
      alert(response.data.message); // Show success message

      // Update the donation status in UI
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation.donationId === donationId
            ? { ...donation, status: "acceptedByVolunteer" }
            : donation
        )
      );

      // Move donation to accepted donations list
      const acceptedDonation = donations.find(
        (donation) => donation.donationId === donationId
      );
      setAcceptedDonations((prevAccepted) => [...prevAccepted, acceptedDonation]);
    } catch (error) {
      console.error("Error accepting donation:", error.message);
      alert("Failed to accept donation. Please try again.");
    }
  };

  const pickUpDonation = async (donationId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/donation/volunteer/pickup/${donationId}`,
        {}, // Empty body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      alert(response.data.message); // Show success message

      // Update the donation status in UI to 'pickedByVolunteer'
      setAcceptedDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation.donationId === donationId
            ? { ...donation, status: "pickedByVolunteer" }
            : donation
        )
      );
    } catch (error) {
      console.error("Error picking up donation:", error.message);
      alert("Failed to pick up donation. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Left Side: All Transactions */}
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>All Transactions</h2>
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

                {/* Arrow */}
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

                {/* Receiver Details */}
                <div style={{ flex: 1, textAlign: "center" }}>
                  <h3 style={{ color: "#007bff" }}>Receiver</h3>
                  <p>
                    <strong>Name:</strong>{" "}
                    {donation.receiver?.name || "Receiver information unavailable"}
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
                    onClick={() => acceptDonation(donation.donationId)}
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
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
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
                    {donation.receiver?.name || "Receiver information unavailable"}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {donation.receiver?.location
                      ? `${donation.receiver.location.landmark} (${donation.receiver.location.lat}, ${donation.receiver.location.long})`
                      : "Location unavailable"}
                  </p>
                </div>
              </div>

              {/* Picked Up Button */}
              {donation.status === "acceptedByVolunteer" && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    onClick={() => pickUpDonation(donation.donationId)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    disabled={donation.status === "pickedByVolunteer"}
                  >
                    {donation.status === "pickedByVolunteer"
                      ? "Donation Picked Up"
                      : "Pick Up Donation"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Volunteer;

