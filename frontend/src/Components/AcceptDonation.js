// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./styles/Donor.css";

// const AcceptDonation = () => {
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch donations from the API
//   useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("Token is missing.");
//           return;
//         }

//         const response = await axios.get("http://localhost:3001/api/donation", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setDonations(response.data.donations); // Assuming donations are returned in response.data.donations
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching donations:", err);
//         setError("Failed to fetch donations.");
//         setLoading(false);
//       }
//     };

//     fetchDonations();
//   }, []);

//   if (loading) {
//     return <div>Loading donations...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="donations-container">
//       <h3>Active Donations</h3>
//       {donations.length === 0 ? (
//         <div>No active donations available.</div>
//       ) : (
//         donations.map((donation) => {
//           if (
//             donation.status === "approved" ||
//             donation.status === "pickbyreceiver" ||
//             donation.status === "rejected"
//           ) {
//             return (
//               <div
//                 key={donation._id}
//                 className={`donation-card ${donation.status}`}
//               >
//                 <h4>{donation.donorName || "Donor Name"}</h4>
//                 <p>Quantity: {donation.quantity}</p>
//                 <p>Status: {donation.status}</p>
//                 <p>Location: {donation.location?.landmark || "N/A"}</p>
//                 <p>Created At: {new Date(donation.createdAt).toLocaleString()}</p>
//                 <button onClick={() => handleAcceptDonation(donation)}>
//                   Accept Donation
//                 </button>
//               </div>
//             );
//           }
//           return null;
//         })
//       )}
//     </div>
//   );

//   function handleAcceptDonation(donation) {
//     console.log("Donation accepted:", donation);
//     // Implement the logic for accepting the donation
//   }
// };

// export default AcceptDonation;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./styles/Donor.css";

// const AcceptDonation = () => {
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("Token is missing.");
//           return;
//         }

//         const response = await axios.get("http://localhost:3001/api/donation", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setDonations(response.data.donations);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching donations:", err);
//         setError("Failed to fetch donations.");
//         setLoading(false);
//       }
//     };

//     fetchDonations();
//   }, []);

//   const handleVolunteerDecision = async (donation, isSelfVolunteer) => {
//     if (isSelfVolunteer) {
//       try {
//         const token = localStorage.getItem("token");
//         await axios.patch(
//           `http://localhost:3001/api/donation/${donation._id}/status`,
//           { status: "pickbydonor" },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setDonations(donations.map(d => d._id === donation._id ? { ...d, status: "pickbydonor" } : d));
//       } catch (err) {
//         console.error("Error updating to self-volunteer:", err);
//       }
//     } else {
//       window.location.href = `/need-volunteer/${donation._id}`;
//     }
//   };

//   const handleConfirmPickup = async (donation) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(
//         `http://localhost:3001/api/donation/${donation._id}/status`,
//         { status: "completed" },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setDonations(donations.map(d => d._id === donation._id ? { ...d, status: "completed" } : d));
//     } catch (err) {
//       console.error("Error confirming pickup:", err);
//     }
//   };

//   if (loading) {
//     return <div>Loading donations...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="donations-container">
//       <h3>Approved Donations</h3>
//       {donations.length === 0 ? (
//         <div>No active donations available.</div>
//       ) : (
//         donations.map((donation) => (
//           <div key={donation._id} className={`donation-card ${donation.status}`}>
//             <h4>{donation.receiver?.name || "Receiver Name"}</h4>
//             <p>Quantity: {donation.quantity}</p>
//             <p>Status: {donation.status}</p>
//             <p>Location: {donation.location?.landmark || "N/A"}</p>
//             <p>Created At: {new Date(donation.createdAt).toLocaleString()}</p>

//             {donation.status === "approved" && (
//               <div>
//                 <button 
//                   onClick={() => handleVolunteerDecision(donation, true)} 
//                   disabled={donation.status === "pickbydonor"}>
//                   Self Volunteer
//                 </button>
//                 <button 
//                   onClick={() => handleVolunteerDecision(donation, false)} 
//                   disabled={donation.status === "pickbydonor"}>
//                   Need Volunteer
//                 </button>
//               </div>
//             )}

//             {["pickbyreceiver", "pickbyvolunteer"].includes(donation.status) && (
//               <button onClick={() => handleConfirmPickup(donation)}>
//                 Confirm Pickup
//               </button>
//             )}

//             {donation.status === "rejected" && (
//               <p className="rejected-status">This donation has been rejected.</p>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AcceptDonation;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Donor.css";

const AcceptDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing.");
          return;
        }

        const response = await axios.get("http://localhost:3001/api/donation", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDonations(response.data.donations);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to fetch donations.");
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleVolunteerDecision = async (donation, isSelfVolunteer) => {
    if (isSelfVolunteer) {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `http://localhost:3001/api/donation/${donation._id}/status`,
          { status: "pickbydonor" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDonations(donations.map(d => d._id === donation._id ? { ...d, status: "pickbydonor" } : d));
      } catch (err) {
        console.error("Error updating to self-volunteer:", err);
      }
    } else {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
          `http://localhost:3001/api/donation/need-volunteer/${donation._id}`,
          { needVolunteer: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDonations(donations.map(d => d._id === donation._id ? { ...d, ...response.data.donation } : d));
      } catch (err) {
        console.error("Error marking donation as needing volunteer:", err);
      }
    }
  };

  const handleConfirmPickup = async (donation) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3001/api/donation/${donation._id}/status`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDonations(donations.map(d => d._id === donation._id ? { ...d, status: "completed" } : d));
    } catch (err) {
      console.error("Error confirming pickup:", err);
    }
  };

  if (loading) {
    return <div>Loading donations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="donations-container">
      <h3>Approved Donations</h3>
      {donations.length === 0 ? (
        <div>No active donations available.</div>
      ) : (
        donations.map((donation) => (
          <div key={donation._id} className={`donation-card ${donation.status}`}>
            <h4>{donation.receiver?.name || "Receiver Name"}</h4>
            <p>Quantity: {donation.quantity}</p>
            <p>Status: {donation.status}</p>
            <p>Location: {donation.location?.landmark || "N/A"}</p>
            <p>Created At: {new Date(donation.createdAt).toLocaleString()}</p>

            {donation.status === "approved" && !donation.needVolunteer && (
              <div>
                <button 
                  onClick={() => handleVolunteerDecision(donation, true)} 
                  disabled={donation.status === "pickbydonor"}>
                  Self Volunteer
                </button>
                <button 
                  onClick={() => handleVolunteerDecision(donation, false)} 
                  disabled={donation.status === "pickbydonor"}>
                  Need Volunteer
                </button>
              </div>
            )}

            {donation.needVolunteer && donation.status === "approved" && (
              <p className="volunteer-request">Current request is sent for a volunteer.</p>
            )}

            {donation.status === "requestacceptedbyvolunteer" && (
              <p className="accepted-by-volunteer">Request accepted by a volunteer.</p>
            )}

            {["pickbyreceiver", "pickbyvolunteer"].includes(donation.status) && (
              <button onClick={() => handleConfirmPickup(donation)}>
                Confirm Pickup
              </button>
            )}

            {donation.status === "rejected" && (
              <p className="rejected-status">This donation has been rejected.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AcceptDonation;
