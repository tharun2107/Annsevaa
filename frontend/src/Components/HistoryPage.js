import React, { useEffect, useState } from "react";
import HistoryCard from "./HistoryCard";
import "./styles/History.css";
import axios from "axios";

const HistoryPage = ({ apiEndpoint, type }) => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing.");
          return;
        }

        const response = await axios.get(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = response.data;
        console.log("Fetched Donation Data:", data);

        if (Array.isArray(data)) {
          // Filter out invalid donations
          const sanitizedData = data.filter(
            (donation) =>
              donation &&
              donation.donationDetails &&
              donation.donationDetails.quantity !== undefined
          );
          setDonations(sanitizedData);
        } else {
          console.error("Data is not an array.");
        }
      } catch (error) {
        console.error(`Error fetching ${type} history:`, error);
      }
    };

    fetchHistory();
  }, [apiEndpoint, type]);

  return (
    <div className="history-page">
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)} History</h1>
      {donations.length > 0 ? (
        donations.map((donation) => (
          <HistoryCard
            key={donation.donationId}
            donation={donation}
            type={type}
          />
        ))
      ) : (
        <div className="no-donations">No donation history available.</div>
      )}
    </div>
  );
};

export default HistoryPage;
