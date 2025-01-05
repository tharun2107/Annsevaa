import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import DonateForm from "./DonateForm";
import "./styles/Donor.css";
import axios from "axios";
import AcceptDonation from "./AcceptDonation";
// Custom marker icons
const donorIcon = new L.Icon({
    iconUrl: "https://cdn3d.iconscout.com/3d/premium/thumb/blood-donation-location-10321765-8355310.png",
    iconSize: [50, 50],
});

const orgIcon = new L.Icon({
    iconUrl: "https://static.vecteezy.com/system/resources/previews/015/088/548/non_2x/business-organization-location-vector.jpg",
    iconSize: [50, 50],
});

const requestIcon = new L.Icon({
    iconUrl: "https://png.pngtree.com/png-clipart/20191121/original/pngtree-vector-location-icon-png-image_5159127.jpg",
    iconSize: [50, 50],
});

// Haversine formula to calculate distance between two lat-lng points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in km
}

const DonorPage = () => {
    const donorLocation = { lat: 12.9716, lng: 77.5946 }; // Donor's location

    const [activeRequests, setActiveRequests] = useState([]);
    const [activeOrganizations, setActiveOrganizations] = useState([]);
    const [showDonateForm, setShowDonateForm] = useState(false); // State to manage DonateForm visibility
    const [currentDonationData, setCurrentDonationData] = useState(null); // Store donation data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
                if (!token) {
                    console.error("Token is missing.");
                    return;
                }

                const response = await axios.get(
                    "http://localhost:3001/api/requests",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = response.data;
                const requests = data.requests || [];
                const organizations = data.organizations || [];

                setActiveRequests(requests);
                setActiveOrganizations(organizations);
             
            } catch (error) {
                console.error("Error fetching donation data:", error);
            }
        };

        fetchData();
    }, []);

    const handleDonateClick = (data) => {
        console.log("Data clicked:", data);  // Log the data to verify it's being passed correctly
        setCurrentDonationData(data);
        setShowDonateForm(true); // Show the DonateForm on button click
    };

    const closeDonateForm = () => {
        setShowDonateForm(false); // Close the DonateForm
    };

    useEffect(() => {
        console.log("Current Donation Data Updated:", currentDonationData);
    }, [currentDonationData]);  // Log when currentDonationData is updated

    return (
        <div className="donor-page">
            <div className="map-container">
                <MapContainer center={donorLocation} zoom={20} style={{ height: "500px", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={donorLocation} icon={donorIcon}>
                        <Popup>Donor Location</Popup>
                    </Marker>
                    {[...activeRequests, ...activeOrganizations].map((loc) => {
                        if (loc.lat && loc.lng) {
                            const icon = loc.type === "organization" ? orgIcon : requestIcon;
                            return (
                                <Marker key={loc._id || loc.id} position={[loc.lat, loc.lng]} icon={icon}>
                                    <Popup>{loc.name || "No Name"}</Popup>
                                </Marker>
                            );
                        }
                        return null;
                    })}
                </MapContainer>
                <div>
            <AcceptDonation />
            </div>
            </div>
            
                

            <div className="requests-container">
                <h3>Active Requests</h3>
                <ul>
                    {activeRequests.map((item) => (
                        item._id ? (
                            <li key={item._id} className="request">
                                <h4>{item.receiverName || "Request"}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Phone: {item.receiverPhone}</p>
                                <p>Address: {item.receiverAddress}</p>
                                <p>Requested At: {new Date(item.createdAt).toLocaleString()}</p>
                                <button onClick={() => handleDonateClick(item)}>Donate</button>
                            </li>
                        ) : null
                    ))}
                </ul>

                <h3>Active Organizations</h3>
                <ul>
                    {activeOrganizations.map((item) => (
                        item._id ? (
                            <li key={item._id} className="organization">
                                <h4>{item.name || "Organization"}</h4>
                                <p>Phone: {item.phone}</p>
                                <p>Is Active: {item.isActive ? "Yes" : "No"}</p>
                                <button onClick={() => handleDonateClick(item)}>Donate</button>
                            </li>
                        ) : null
                    ))}
                </ul>
            </div>

            {/* Conditionally render the DonateForm */}
            {showDonateForm && (
  <DonateForm 
    receiverId={currentDonationData._id} 
    setShowForm={setShowDonateForm} 
  />
)}

        </div>
    );
};

export default DonorPage;

