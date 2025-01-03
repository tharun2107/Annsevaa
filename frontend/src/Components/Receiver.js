import { useEffect, useState } from "react";
import axios from 'axios';

export const Receiver = () => {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                // Log to ensure token and user are present
                console.log("Token:", token);
                console.log("User:", user);

                const response = await axios.post('http://localhost:3001/api/requests/getDonation', 
                    { user },  // Send user in body
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setDonations(response.data);
            } catch (error) {
                console.error("Error fetching donations:", error);
            }
        };
        
        fetchDonations();
    }, []);

    return (
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
            {donations.map((donation) => (
                <div key={donation._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
                    <h3>Donation Details</h3>
                    <p><strong>Donor ID:</strong> {donation.donorId}</p>
                    <p><strong>Location:</strong> {donation.location.landmark}</p>
                    <p><strong>Latitude:</strong> {donation.location.lat}</p>
                    <p><strong>Longitude:</strong> {donation.location.long}</p>
                    <p><strong>Quantity:</strong> {donation.quantity}</p>
                    <p><strong>Shelf Life (days):</strong> {donation.shelfLife}</p>
                    <p><strong>Status:</strong> {donation.status}</p>
                </div>
            ))}
        </div>
    );
}
