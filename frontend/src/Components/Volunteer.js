import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/volunteer.css";

const Volunteer = () => {
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [donationToAccept, setDonationToAccept] = useState(null);
  const [donationToPickUp, setDonationToPickUp] = useState(null);

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

    // Set interval to fetch donations every 10 seconds
    const intervalId = setInterval(fetchDonations, 10000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Effect for accepting a donation
  useEffect(() => {
    if (donationToAccept) {
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
            prevDonations.filter((donation) => donation.donationId !== donationId)
          );

          const acceptedDonation = donations.find(
            (donation) => donation.donationId === donationId
          );
          setAcceptedDonations((prevAccepted) => [
            ...prevAccepted,
            { ...acceptedDonation, status: "requestacceptedbyvolunteer" },
          ]);
        } catch (error) {
          console.error("Error accepting donation:", error.message);
          alert("Failed to accept donation. Please try again.");
        }
      };

      acceptDonation(donationToAccept);
      setDonationToAccept(null); // Reset the donation to accept
    }
  }, [donationToAccept, donations]); // Dependency array includes donationToAccept and donations

  // Effect for picking up a donation
  useEffect(() => {
    if (donationToPickUp) {
      const pickUpDonation = async (donationId) => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.patch(
            `http://localhost:3001/api/volunteer/pickedfood/${donationId}`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
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
          console.error("Error picking up donation:", error.message);
          alert("Failed to pick up donation. Please try again.");
        }
      };

      pickUpDonation(donationToPickUp);
      setDonationToPickUp(null); // Reset the donation to pick up
    }
  }, [donationToPickUp]); // Dependency array includes donationToPickUp

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
                  <span style={{ fontSize: "24px", color: "#333", fontWeight: "bold" }}>
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
                    onClick={() => setDonationToAccept(donation.donationId)}
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
          <p style={{ textAlign: "center", color: "blue" }}>No accepted donations yet.</p>
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
                      
                      {console.log(donation.donationId)}
              {/* Pick Up Button */}
              {donation.status === "requestacceptedbyvolunteer" && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    onClick={() => setDonationToPickUp(donation.donationId)}
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
