import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const Receiver = () => {
  const [donations, setDonations] = useState([]);
  const [volunteerStatus, setVolunteerStatus] = useState({});
  const [approvedDonations, setApprovedDonations] = useState([]);
  const [requestQuantity, setRequestQuantity] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseColor, setResponseColor] = useState("");

  const fetchDonations = useCallback(async () => {
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
      if (response.data.success === false) {
        toast.error(response.data.message);
      } else if (response.data.success === true && response.status === 200) {
        setDonations([response.data.donation]);
        //toast.success(response.data.message || "Donations fetched successfully.");
      } else if (response.data.success === true && response.status === 204) {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Error fetching donations.");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDonations();
    }, 5000); // Poll every  seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [fetchDonations]);

  const handleApprove = async (donationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/requests/accept",
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
if (response.data.success === true && response.status === 200) {
        toast.success("Donation approved successfully.");
        const approvedDonation = donations.find(
          (donation) => donation.donationId === donationId
        );
        setApprovedDonations((prev) => [...prev, approvedDonation]);
        setDonations(donations.filter((donation) => donation.donationId !== donationId));
      } else if (response.data.success === true && response.status === 204) {
        toast.error(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Error approving donation.");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Unexpected error occurred.");
      }
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
      if (response.data.success === true && response.status === 200) {
        toast.success("Donation rejected successfully.");
      } else if (response.data.success === true && response.status === 204) {
        toast.error(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Error rejecting donation.");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  const handleRequestFood = async () => {
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
      if (response.data.success === true && response.status === 200) {
        toast.success("Food request submitted successfully.");
        setRequestQuantity("");
      } else if (response.data.success === true && response.status === 204) {
        toast.error(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Error submitting food request.");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  const handleVolunteerChange = (donationId, isChecked) => {
    setVolunteerStatus((prevStatus) => ({
      ...prevStatus,
      [donationId]: isChecked,
    }));
  };

  const handleReceivedFood = async (donationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/requests/completed",
        { donationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success === true && response.status === 200) {
        toast.success("Donation marked as completed.");
  
        // Remove the completed donation from the list of approved donations
        setApprovedDonations(
          approvedDonations.filter((donation) => donation.donationId !== donationId)
        );
      } else if (response.data.success === true && response.status === 204) {
        toast.error(response.data.message || "No content available.");
      } else {
        toast.error(response.data.message || "An error occurred.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Error marking donation as completed."
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", padding: "30px", position: "relative" }}>
      {/* Response message */}
      {responseMessage && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "20px",
            padding: "10px 12px",
            backgroundColor: responseColor,
            color: "#fff",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          {responseMessage}
        </div>
      )}
  
      {/* Donations */}
      <div style={{ flex: 1, minWidth: "300px", margin: "10px" }}>
        <h2>Donations</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <div
                key={donation.donationId}
                style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  flex: "1 1 calc(50% - 20px)",
                  maxWidth: "400px",
                }}
              >
                <h3 style={{ color: "#333" }}>Donation Details</h3>
                <p><strong>Donor:</strong> {donation.donorName}</p>
                <p><strong>Quantity:</strong> {donation.quantity}</p>
                <p><strong>Location:</strong> {donation.location}</p>
                {donation.status !== "Completed" && (
                  <>
                    <label style={{ display: "block", marginTop: "10px" }}>
                      <input
                        type="checkbox"
                        checked={volunteerStatus[donation.donationId] || false}
                        onChange={(e) =>
                          handleVolunteerChange(donation.donationId, e.target.checked)
                        }
                      />
                      {" "} I want to act as a volunteer
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
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
            ))
          ) : (
            <p>No donations available.</p>
          )}
        </div>
      </div>
  
      {/* Approved Donations */}
      <div style={{ flex: 1, minWidth: "300px", margin: "10px" }}>
        <h2>Approved Donations</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {approvedDonations.length > 0 ? (
            approvedDonations.map((donation) => (
              <div
                key={donation.donationId}
                style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  flex: "1 1 calc(50% - 20px)",
                  maxWidth: "400px",
                }}
              >
                <h3 style={{ color: "#333" }}>Donation Details</h3>
                <p><strong>Donor:</strong> {donation.donorName}</p>
                <p><strong>Quantity:</strong> {donation.quantity}</p>
                <p><strong>Location:</strong> {donation.location}</p>
                <button
                  onClick={() => handleReceivedFood(donation.donationId)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2196f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Mark as Received
                </button>
              </div>
            ))
          ) : (
            <p>No approved donations.</p>
          )}
        </div>
      </div>
  
      {/* Food Request */}
      <div style={{ flex: 1, minWidth: "300px", margin: "10px" }}>
        <h2>Request Food</h2>
        <input
          type="number"
          value={requestQuantity}
          onChange={(e) => setRequestQuantity(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
          placeholder="Enter quantity"
        />
        <button
          onClick={handleRequestFood}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Request Food
        </button>
      </div>
      </div>
    )
  }
  