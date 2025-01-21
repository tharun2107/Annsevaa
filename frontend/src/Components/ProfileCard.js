import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTimes } from "react-icons/fa";
import "./styles/ProfileCard.css"; // CSS file for styling

const ProfileCardModal = ({ isOpen, closeModal }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ location: {} });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for saving
  const [isFetching, setIsFetching] = useState(false); // Loading state for fetching

  useEffect(() => {
    const fetchProfile = async () => {
      setIsFetching(true); // Start loading state
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing.");
          return;
        }

        const response = await axios.get("http://localhost:3001/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsFetching(false); // End loading state
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const handleEditClick = (field) => {
    setIsEditing(true);
    setEditedUser({
      ...user,
      [field]: user[field],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleLocationEdit = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setEditedUser((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              lat: latitude,
              long: longitude,
            },
          }));
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation error", error);
          setLoadingLocation(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3001/api/user",
        {
          ...editedUser,
          location: {
            landmark: editedUser.location.landmark,
            lat: editedUser.location.lat,
            long: editedUser.location.long,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
    setIsLoading(false);
  };

  if (!isOpen || isFetching) {
    return null; // Render nothing if modal is closed or fetching data
  }

  return (
    isOpen && user && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="profile-header">
            <h2>User Profile</h2>
            <FaTimes className="close-modal" onClick={closeModal} />
          </div>
          <div className="profile-info">
            <div className="profile-field">
              <strong>Name:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedUser.name || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{user.name}</span>
              )}
              <FaEdit
                className="edit-icon"
                onClick={() => handleEditClick("name")}
              />
            </div>

            <div className="profile-field">
              <strong>Phone:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editedUser.phone || ""}
                  onChange={handleChange}
                />
              ) : (
                <span>{user.phone}</span>
              )}
              <FaEdit
                className="edit-icon"
                onClick={() => handleEditClick("phone")}
              />
            </div>

            <div className="profile-field">
              <strong>Location:</strong>
              <div>
                <label>
                  <strong>Landmark:</strong>
                  <input
                    type="text"
                    name="landmark"
                    value={editedUser.location.landmark || ""}
                    onChange={handleLocationChange}
                  />
                </label>
                <button className="update-coordinates-btn" onClick={handleLocationEdit}>
                  {loadingLocation ? "Fetching location..." : "Update Coordinates"}
                </button>
              </div>
              <FaEdit
                className="edit-icon"
                onClick={() => handleEditClick("location")}
              />
            </div>

            {isEditing && (
              <div className="save-cancel">
                <button className="save-btn" onClick={handleSaveClick} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileCardModal;