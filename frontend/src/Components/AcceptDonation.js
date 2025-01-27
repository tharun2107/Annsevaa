import React, { useEffect, useState } from "react";
import "./styles/Donor.css";
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
          console.error("Token is missing.");
          setError("You are not authorized. Please log in.");
          setLoading(false);
          return;
        }

        const response = await api.get("http://localhost:3001/api/donation", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          if (response.data.donations.length === 0) {
            setError(response.data.msg); // Set the error message from the backend
            setDonations([]); // Set donations to an empty array
          } else {
            setDonations(response.data.donations); // Set the donations
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to fetch donations. Please try again later.");
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleVolunteerDecision = async (donation, isSelfVolunteer) => {
    const token = localStorage.getItem("token");
    try {
      if (isSelfVolunteer) {
        // Receiver opts to volunteer themselves
        await api.patch(
          `http://localhost:3001/api/donation/${donation._id}/status`,
          { status: "pickbydonor" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDonations(donations.map(d => d._id === donation._id ? { ...d, status: "pickbydonor" } : d));
      } else {
        // Receiver opts to request a volunteer
        const response = await api.patch(
          `http://localhost:3001/api/donation/need-volunteer/${donation._id}`,
          { needVolunteer: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDonations(donations.map(d => d._id === donation._id ? { ...d, ...response.data.donation } : d));
      }
    } catch (err) {
      console.error("Error updating donation:", err);
    }
  };

  const handleConfirmPickup = async (donation) => {
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

  if (loading) {
    return <div>Loading donations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
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
                  disabled={donation.status === "pickbydonor"}
                >
                  Self Volunteer
                </button>
                <button
                  onClick={() => handleVolunteerDecision(donation, false)}
                  disabled={donation.status === "pickbydonor"}
                >
                  Need Volunteer
                </button>
              </div>
            )}

            {donation.needVolunteer && donation.status === "approved" && (
              <p className="volunteer-request">
                Current request is sent for a volunteer.
              </p>
            )}

            {donation.status === "requestacceptedbyvolunteer" && (
              <p className="accepted-by-volunteer">
                Request accepted by a volunteer.
              </p>
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
