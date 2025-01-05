import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Donor.css";

const AcceptDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donations from the API
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

        setDonations(response.data.donations); // Assuming donations are returned in response.data.donations
        setLoading(false);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to fetch donations.");
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <div>Loading donations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="donations-container">
      <h3>Active Donations</h3>
      {donations.length === 0 ? (
        <div>No active donations available.</div>
      ) : (
        donations.map((donation) => {
          if (
            donation.status === "approved" ||
            donation.status === "pickbyreceiver" ||
            donation.status === "rejected"
          ) {
            return (
              <div
                key={donation._id}
                className={`donation-card ${donation.status}`}
              >
                <h4>{donation.donorName || "Donor Name"}</h4>
                <p>Quantity: {donation.quantity}</p>
                <p>Status: {donation.status}</p>
                <p>Location: {donation.location?.landmark || "N/A"}</p>
                <p>Created At: {new Date(donation.createdAt).toLocaleString()}</p>
                <button onClick={() => handleAcceptDonation(donation)}>
                  Accept Donation
                </button>
              </div>
            );
          }
          return null;
        })
      )}
    </div>
  );

  function handleAcceptDonation(donation) {
    console.log("Donation accepted:", donation);
    // Implement the logic for accepting the donation
  }
};

export default AcceptDonation;
