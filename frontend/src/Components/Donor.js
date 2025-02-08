import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import api from "../api/axios";
import AcceptDonation from "./AcceptDonation";
import DonateForm from "./DonateForm";
import "./styles/Donor.css";

import Filter from "./Filter";

// Custom marker icons
const donorIcon = new L.Icon({
  iconUrl:
    "https://cdn3d.iconscout.com/3d/premium/thumb/blood-donation-location-10321765-8355310.png",
  iconSize: [50, 50],
});

const orgIcon = new L.Icon({
  iconUrl:
    "https://static.vecteezy.com/system/resources/previews/015/088/548/non_2x/business-organization-location-vector.jpg",
  iconSize: [50, 50],
});

const requestIcon = new L.Icon({
  iconUrl:
    "https://png.pngtree.com/png-clipart/20191121/original/pngtree-vector-location-icon-png-image_5159127.jpg",
  iconSize: [50, 50],
});

const DonorPage = () => {
  console.log(Filter);
  const [quantity, setQuantity] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const donorLocation = {
    lat: user.location.lat,
    lng: user.location.long,
  }; // Donor's location

  const [frequests, setFrequests] = useState([]);
  const [finalOrganizations, setFinalOrganizations] = useState([]);

  const [activeRequests, setActiveRequests] = useState([]);
  const [activeOrganizations, setActiveOrganizations] = useState([]);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [currentDonationData, setCurrentDonationData] = useState(null);
  const [isReceiverRequest, setIsReceiverRequest] = useState(false); // Track donation type
  const [fetchError, setFetchError] = useState(null);
  const [isOrganisation, setIsOrganisation] = useState(false);
  const [orgID, setOrgid] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing.");
          setFetchError("You are not authorized. Please log in.");
          return;
        }

        const response = await api.get(
          "http://localhost:3001/api/donation/getDonations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        const requests = data.requests || [];
        const organizations = data.organizations || [];
        setFrequests(requests);
        setFinalOrganizations(organizations);

        setActiveRequests(requests);
        setActiveOrganizations(organizations);
        setFetchError(null);
      } catch (error) {
        console.error("Error fetching donation data:", error);
        setFetchError("Failed to fetch donations. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleDonateClick = (data, isOrganisation, orgID) => {
    console.log("Data clicked:", data);
    setCurrentDonationData(data);
    setIsOrganisation(isOrganisation);
    if (isOrganisation) {
      setOrgid(orgID);
    }
    setShowDonateForm(true);
  };

  const closeDonateForm = () => {
    setShowDonateForm(false);
  };

  return (
    <div
      className="donor-page"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Filter
        frequests={frequests}
        forganizations={finalOrganizations}
        requests={setActiveRequests}
        organizations={setActiveOrganizations}
      />
      <div
        className="donor-down-side"
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <div className="map-container">
          <MapContainer
            center={donorLocation}
            zoom={20}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={donorLocation} icon={donorIcon}>
              <Popup>Donor Location</Popup>
            </Marker>
            {[...activeRequests, ...activeOrganizations].map((req) => {
              if (req.location) {
                const icon = req.role === "receiver" ? orgIcon : requestIcon;
                return (
                  <Marker
                    key={req._id || req.id}
                    position={[req.location.lat, req.location.long]}
                    icon={icon}
                  >
                    <Popup>{req.name || "No Name"}</Popup>
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
          {fetchError ? (
            <div className="error-message">
              <p>{fetchError}</p>
            </div>
          ) : (
            <>
              <h3>Active Requests</h3>
              <ul>
                {activeRequests.map((item) =>
                  item._id ? (
                    <li key={item._id} className="request">
                      <h4>{item.receiverName || "Request"}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Phone: {item.receiverPhone}</p>
                      <p>Address: {item.receiverAddress}</p>
                      <p>
                        Requested At:{" "}
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleDonateClick(item, false, null)}
                      >
                        Donate
                      </button>
                    </li>
                  ) : null
                )}
              </ul>

              <h3>Active Organizations</h3>
              <ul>
                {activeOrganizations.map((item) =>
                  item._id ? (
                    <li key={item._id} className="organization">
                      <h4>{item.name || "Organization"}</h4>
                      <p>Phone: {item.phone}</p>
                      <p>Is Active: {item.isActive ? "Yes" : "No"}</p>
                      <button
                        onClick={() => handleDonateClick(item, true, item._id)}
                      >
                        Donate
                      </button>
                    </li>
                  ) : null
                )}
              </ul>
            </>
          )}
        </div>

        {showDonateForm && (
          <DonateForm
            receiverId={currentDonationData.receiverId}
            setShowForm={setShowDonateForm}
            quantity={quantity}
            setQuantity={setQuantity}
            requestId={currentDonationData._id || currentDonationData.id}
            activerequests={setActiveRequests}
            activeorganizations={setActiveOrganizations}
            isOrganisation={isOrganisation}
            orgID={orgID}
          />
        )}
      </div>
    </div>
  );
};

export default DonorPage;