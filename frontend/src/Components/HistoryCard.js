import React from "react";
import "./styles/History.css";

const HistoryCard = ({ donation = {} }) => {
  // Safely destructure donation object with defaults
  const {
    donationDetails = {},
    donationId = "Unknown ID",
    donor = { name: "Unknown Donor", phone: "N/A", location: { landmark: "N/A" } },
    receiver = { name: "Unknown Receiver", phone: "N/A", location: { landmark: "N/A" } },
    volunteer = { name: "No details available", phone: "N/A", location: { landmark: "N/A" } }, // Default message if no volunteer info
  } = donation;

  const {
    quantity = "N/A",
    status = "Status unavailable",
    location = { landmark: "N/A", lat: "N/A", long: "N/A" },
    createdAt = null,
  } = donationDetails;

  const { lat, long } = location;

  return (
    <div className="history-card">
     

      <div className="card-section">
        <h3>Donor:</h3>
        <p><span>Name:</span> {donor.name}</p>
        <p><span>Phone:</span> {donor.phone}</p>
        <p><span>Location:</span> {donor.location.landmark}</p>
      </div>

      <div className="card-section">
        <h3>Receiver:</h3>
        <p><span>Name:</span> {receiver.name}</p>
        <p><span>Phone:</span> {receiver.phone}</p>
        <p><span>Location:</span> {receiver.location.landmark}</p>
      </div>

      <div className="card-section">
        <h3>Donation Details:</h3>
        <p><span>Quantity:</span> {quantity}</p>
        <p><span>Status:</span> {status}</p>
        <p><span>Location:</span> {location.landmark} </p>
      </div>

      <div className="card-section">
        <h3>Volunteer:</h3>
        <p><span>Name:</span> {volunteer.name?volunteer.name:"No volunteer"}</p>
        <p><span>Phone:</span> {volunteer.phone?volunteer.phone:"No volunteer"  }</p>
        <p>Location: {volunteer.location && volunteer.location.landmark ? volunteer.location.landmark : "N/A"}</p>

      </div>
    </div>
  );
};

export default HistoryCard;
