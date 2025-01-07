import { useEffect, useState } from "react";
import axios from "axios";

export const Receiver = () => {
  const [donations, setDonations] = useState([]);
  const [volunteerStatus, setVolunteerStatus] = useState({});
  const [requestQuantity, setRequestQuantity] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // To store response or error message
  const [responseColor, setResponseColor] = useState(""); // To store message color (green/red)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3001/api/requests/getDonation",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDonations([response.data.donation]);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);

  const handleApprove = async (donationId) => {
    console.log(donationId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/requests/accept", //http://localhost:3001/api/requests/accept
        {
          donationId: donationId,
          approveDonation: true,
          acceptasVolunteer: volunteerStatus[donationId] || false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Donation approved successfully.");
        
        // Update the donation status to "Completed"
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === donationId
              ? { ...donation, status: "Completed" } // Add a "status" field to track completion
              : donation
          )
        );
        setResponseMessage("Donation approved successfully.");
        setResponseColor("green");
      }
    } catch (error) {
      console.error("Error approving donation:", error);
      setResponseMessage("Error approving donation. Please try again.");
      setResponseColor("red");
    }
  };

  const handleReject = async (donationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/requests/reject",
        { donationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data.success) {
        alert("Donation rejected successfully.");
        setResponseMessage("Donation rejected successfully.");
        setResponseColor("green");
      } else {
        alert("Donation rejection failed.");
        setResponseMessage("Donation rejection failed.");
        setResponseColor("red");
      }
    } catch (error) {
      console.error("Error rejecting donation:", error);
      setResponseMessage("Error rejecting donation. Please try again.");
      setResponseColor("red");
    }
  };

  const handleVolunteerChange = (donationId, isChecked) => {
    setVolunteerStatus((prevStatus) => ({
      ...prevStatus,
      [donationId]: isChecked,
    }));
  };

  const handleRequestFood = async () => {
    alert("Requesting food");
    
    if (!requestQuantity || isNaN(requestQuantity) || requestQuantity <= 0) {
      setResponseMessage("Please enter a valid quantity.");
      setResponseColor("red");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/requests",
        { quantity: requestQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        console.log("response.data.message", response.data.request);
        setResponseMessage("Food request submitted successfully.");
        setResponseColor("green");
        setRequestQuantity(""); // Reset the input field
      }
    } catch (error) {
      console.error("Error submitting food request:", error);
      setResponseMessage("Error submitting food request. Please try again.");
      setResponseColor("red");
    }
  };

  return (
    <div style={{ display: "flex", padding: "30px" }}>
      <div style={{ flex: 1 }}>
        <h2>Donations</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {donations.map((donation) => (
            <div
              key={donation.donationId}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                minWidth: "300px",
                maxWidth: "400px",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ color: "#333" }}>Donation Details</h3>
              <p>
                <strong>Donor:</strong> {donation.donorName}
              </p>
              <p>
                <strong>Quantity:</strong> {donation.quantity}
              </p>
              <p>
                <strong>Location:</strong> {donation.location}
              </p>
              {/* <p>
                <strong>Status:</strong> {donation.status || "Pending"}
              </p> */}
              {donation.status !== "Completed" && (
                <>
                  <label style={{ display: "block", marginTop: "10px" }}>
                    <input
                      type="checkbox"
                      checked={volunteerStatus[donation._id] || false}
                      onChange={(e) =>
                        handleVolunteerChange(donation._id, e.target.checked)
                      }
                    />{" "}
                    I want to act as a volunteer
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={() => handleApprove(donation.donationId)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(donation.donationId)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginRight: "60vh", maxWidth: "300px" }}>
        <h2 style={{ margin: "40px" }}>Request Food</h2>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            width: "50vh",
          }}
        >
          <label style={{ display: "block", marginBottom: "10px" }}>
            <strong>Quantity:</strong>
          </label>
          <input
            type="number"
            value={requestQuantity}
            onChange={(e) => setRequestQuantity(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "30px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={handleRequestFood}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          <p style={{ marginTop: "10px", color: responseColor }}>
            {responseMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
