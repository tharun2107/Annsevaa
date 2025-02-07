// import React, { useEffect, useState } from "react";
// import "./styles/Donor.css";
// import api from "../api/axios";

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
//           setError("You are not authorized. Please log in.");
//           setLoading(false);
//           return;
//         }

//         const response = await api.get("http://localhost:3001/api/donation", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 200) {
//           if (response.data.donations.length === 0) {
//             setError(response.data.msg); // Set the error message from the backend
//             setDonations([]); // Set donations to an empty array
//           } else {
//             setDonations(response.data.donations); // Set the donations
//           }
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching donations:", err);
//         setError("Failed to fetch donations. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchDonations();
//   }, []);

//   const handleVolunteerDecision = async (donation, isSelfVolunteer) => {
//     const token = localStorage.getItem("token");
//     try {
//       if (isSelfVolunteer) {
//         // Receiver opts to volunteer themselves
//         await api.patch(
//           `http://localhost:3001/api/donation/${donation._id}/status`,
//           { status: "pickbydonor" },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setDonations(donations.map(d => d._id === donation._id ? { ...d, status: "pickbydonor" } : d));
//       } else {
//         // Receiver opts to request a volunteer
//         const response = await api.patch(
//           `http://localhost:3001/api/donation/need-volunteer/${donation._id}`,
//           { needVolunteer: true },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setDonations(donations.map(d => d._id === donation._id ? { ...d, ...response.data.donation } : d));
//       }
//     } catch (err) {
//       console.error("Error updating donation:", err);
//     }
//   };

  // const handleConfirmPickup = async (donation) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await api.patch(
  //       `http://localhost:3001/api/donation/${donation._id}/status`,
  //       { status: "completed" },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setDonations(donations.map(d => d._id === donation._id ? { ...d, status: "completed" } : d));
  //   } catch (err) {
  //     console.error("Error confirming pickup:", err);
  //   }
  // };

//   if (loading) {
//     return <div>Loading donations...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
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

//             {donation.status === "approved" && !donation.needVolunteer && (
//               <div>
//                 <button
//                   onClick={() => handleVolunteerDecision(donation, true)}
//                   disabled={donation.status === "pickbydonor"}
//                 >
//                   Self Volunteer
//                 </button>
//                 <button
//                   onClick={() => handleVolunteerDecision(donation, false)}
//                   disabled={donation.status === "pickbydonor"}
//                 >
//                   Need Volunteer
//                 </button>
//               </div>
//             )}

//             {donation.needVolunteer && donation.status === "approved" && (
//               <p className="volunteer-request">
//                 Current request is sent for a volunteer.
//               </p>
//             )}

//             {donation.status === "requestacceptedbyvolunteer" && (
//               <p className="accepted-by-volunteer">
//                 Request accepted by a volunteer.
//               </p>
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

// // FRONTEND
// import React, { useEffect, useState } from "react";
// import "./styles/Donor.css";
// import api from "../api/axios";

// const AcceptDonation = () => {
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("You are not authorized. Please log in.");
//           setLoading(false);
//           return;
//         }

//         const response = await api.get("http://localhost:3001/api/donation", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setDonations(response.data.donations || []);
//         console.log(response.data.donations);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch donations. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchDonations();
//   }, []);

//   const handleSelfVolunteer = async (donation) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await api.patch(
//         `http://localhost:3001/api/donation/${donation._id}/status`,
//         { status: "pickbydonor" },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setDonations((prevDonations) =>
//         prevDonations.map((d) =>
//           d._id === donation._id ? { ...d, ...response.data.donation } : d
//         )
//       );
//     } catch (err) {
//       console.error("Error volunteering as donor:", err);
//     }
//   };

 
  // const handlePickupByVolunteer = async (donation) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const response = await api.patch(
  //       `http://localhost:3001/api/donation/${donation._id}/pick-food`,
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     setDonations((prevDonations) =>
  //       prevDonations.map((d) =>
  //         d._id === donation._id ? { ...d, ...response.data.donation } : d
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Error updating donation status:", err);
  //   }
  // };

//   const handleCompletion = async (donation) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await api.patch(
//         `http://localhost:3001/api/donation/${donation._id}/complete`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setDonations((prevDonations) =>
//         prevDonations.map((d) =>
//           d._id === donation._id ? { ...d, ...response.data.donation } : d
//         )
//       );
//     } catch (err) {
//       console.error("Error completing donation:", err);
//     }
//   };

//   if (loading) return <div>Loading donations...</div>;

//   if (error) return <div className="error-message">{error}</div>;

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

//             {/* Approved State */}
//             {donation.status === "approved" && (
//               <>
//                 {donation.needVolunteer ? (
//                   <p>Current request is sent for volunteer.</p>
//                 ) : (
//                   <>
//                     <button onClick={() => handleSelfVolunteer(donation)}>
//                       Self Volunteer
//                     </button>
                    // <button
                    //     onClick={() => handleNeedVolunteer(donation)}
                    //     disabled={donation.needVolunteer}
                    //   >
//                         Need Volunteer
//                       </button>
//                   </>
//                 )}
//               </>
//             )}

//             {/* Request Accepted by Volunteer */}
//             {/* && donation.volunteerDetails && */}
//             {donation.status === "requestacceptedbyvolunteer" && (
//               <div>

//                 {/* <p>Volunteer Name: {donation.volunteerDetails.name}</p>
//                 <p>Contact: {donation.volunteerDetails.contact}</p> */}
                // <button onClick={() => handlePickupByVolunteer(donation)}>
                //   Pick Food
                // </button>
//               </div>
//             )}

//             {/* Picked by Volunteer */}
//             {donation.status === "pickbyvolunteer" && (
//               <div>
//                 {/* <p>Status: Food Picked by Volunteer</p> */}
//                 <button onClick={() => handleCompletion(donation)}>
//                   Mark as Completed
//                 </button>
//               </div>
//             )}

            // {/* Picked by receiver id pickby donor no thing to do in donor page it should accpet by receiver */}
            // {donation.status === "pickbyreceiver" && (
            //   <div>
            //     {/* <p>Status: Food Picked by Donor</p> */}
            //     <button onClick={() => handleCompletion(donation)}>
            //       Mark as Completed
            //     </button>
            //   </div>
            // )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AcceptDonation;


import React, { useEffect, useState } from "react";
import "./styles/AceeptDonation.css";
import api from "../api/axios";

const AcceptDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not authorized. Please log in.");
          setLoading(false);
          return;
        }

        const response = await api.get("http://localhost:3001/api/donation", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDonations(response.data.donations || []);
        console.log(response.data.donations);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch donations. Please try again later.");
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleSelfVolunteer = async (donation) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.patch(
        `http://localhost:3001/api/donation/${donation._id}/status`,
        { status: "pickbydonor" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDonations((prevDonations) =>
        prevDonations.map((d) =>
          d._id === donation._id ? { ...d, ...response.data.donation } : d
        )
      );
    } catch (err) {
      console.error("Error volunteering as donor:", err);
    }
  };
  const handleCompletion = async (donation) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
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

  const handleNeedVolunteer = async (donation) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.patch(
        `http://localhost:3001/api/donation/need-volunteer/${donation._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDonations((prevDonations) =>
        prevDonations.map((d) =>
          d._id === donation._id ? { ...d, ...response.data.donation } : d
        )
      );
    } catch (err) {
      console.error("Error sending volunteer request:", err);
    }
  };
  const handlePickupByVolunteer = async (donation) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.patch(
        `http://localhost:3001/api/donation/${donation._id}/pick-food`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDonations((prevDonations) =>
        prevDonations.map((d) =>
          d._id === donation._id ? { ...d, ...response.data.donation } : d
        )
      );
    } catch (err) {
      console.error("Error updating donation status:", err);
    }
  };


  if (loading) return <div>Loading donations...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="donations-container">
      <h3>Approved Donations</h3>
      {donations.length === 0 ? (
        <div>No active donations available.</div>
      ) : (
        donations.map((donation) => (
          <div key={donation._id} className={`donation-card ${donation.status}`}>
            <h4>Receiver Details</h4>
            <p>{donation.receiverDetails?.name || "Receiver Name"}</p>
            <p>Phone: {donation.receiverDetails?.phone || "Receiver Contact"}</p>
            <p>Location: {donation.receiverDetails?.location.landmark || "Receiver Location"}</p>
            <p>Quantity: {donation.quantity}</p>
            <p>Status: {donation.status}</p>
            <p>Created At: {new Date(donation.createdAt).toLocaleString()}</p>

            {/* Volunteer Details */}
            {donation.status === "requestacceptedbyvolunteer" && (
              <div>
                <h5>Volunteer Details</h5>
                {donation.volunteerDetails ? (
                  <>
                    <p>Name: {donation.volunteerDetails.name}</p>
                    <p>Contact: {donation.volunteerDetails.phone}</p>
                    <p>Location: {donation.volunteerDetails.location?.landmark || "N/A"}</p>
                  </>
                ) : (
                  <p>No volunteer assigned yet.</p>
                )}
                  <button onClick={() => handlePickupByVolunteer(donation)}>
                  Pick Food
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {donation.status === "approved" && (
              <div>
                {donation.needVolunteer ? (
                  <p>Current request is sent for volunteer.</p>
                ) : (
                  <>
                    <button onClick={() => handleSelfVolunteer(donation)}>
                      Self Volunteer
                    </button>
                    <button
                        onClick={() => handleNeedVolunteer(donation)}
                        disabled={donation.needVolunteer}
                      >
                      Need Volunteer
                    </button>
                    </>
                    
                )}
              </div>
            )}
             {/* Picked by receiver id pickby donor no thing to do in donor page it should accpet by receiver */}
             {donation.status === "pickbyreceiver" && (
              <div>
                {/* <p>Status: Food Picked by Donor</p> */}
                <button onClick={() => handleCompletion(donation)}>
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AcceptDonation;
