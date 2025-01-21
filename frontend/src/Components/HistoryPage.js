import React, { useEffect, useState } from 'react';
import HistoryCard from './HistoryCard';
import './styles/History.css';
import axios from 'axios';
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

                const response = await axios.get(
                    apiEndpoint,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                // const response = await fetch(apiEndpoint);
                const data = response.data;
                console.log(data);
                setDonations(data);
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
                    <HistoryCard key={donation.donationId} donation={donation} type={type} />
                ))
            ) : (
                <div className="no-donations">No donation history available.</div>
            )}
        </div>
    );
};

export default HistoryPage;