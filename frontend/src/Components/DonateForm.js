import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  FaCamera,
  FaClock,
  FaUtensils,
  FaWeight
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles/DonateForm.css";

const DonateForm = ({ request, requestId, setShowForm }) => {
  const [foodItems, setFoodItems] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shelfLife, setShelfLife] = useState("");
  const [picture, setPicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(); // Create a new FormData object
    formData.append("foodItems", foodItems);
    formData.append("quantity", quantity);
    formData.append("shelfLife", shelfLife);
    formData.append("picture", picture); // Append the actual file
    formData.append("requestId", requestId);

    try {
      const response = await axios.post(
        "http://localhost:9004/api/donation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.status != 201) {
        console.log("error posting donation");
      }
      alert(
        "Donation submitted successfully! thank you for your generous donation"
      );
      toast.success("Donation submitted successfully!");
      setShowModal(false);
      setShowForm(false); // Ensure the form is closed after submission
      navigate("/user-type-selection");
      resetForm();
    } catch (error) {
      toast.error("Failed to submit donation.");
    }
  };

  const resetForm = () => {
    setFoodItems("");
    setQuantity("");
    setShelfLife("");
    setPicture(null);
    setPreviewImage(null);
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    setPicture(file); // Store the actual file

    // Create a URL to display the image preview locally
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // Only set the preview, not the file itself
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container custom-modal">
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setShowForm(false);
          navigate(`/donate`);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Donate Food Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form style={styles.form}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <FaUtensils className="me-2" /> Food Items:
                  </label>
                  <input
                    type="text"
                    value={foodItems}
                    onChange={(e) => setFoodItems(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <FaWeight className="me-2" /> Quantity:
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <FaClock className="me-2" /> Shelf Life (in hours):
                  </label>
                  <input
                    type="number"
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <FaCamera className="me-2" /> Picture:
                  </label>
                  <input
                    type="file"
                    onChange={handlePictureChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="image-preview">
                  {previewImage ? (
                    <img src={previewImage} alt="Uploaded Image" />
                  ) : (
                    "Donate FOOD"
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-center">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-success mt-3"
                >
                  Submit Donation
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

const styles = {
  greenButton: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  form: {
    minWidth: "400px",
  },
  mapBox: {
    height: "400px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  mapPlaceholderText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#999",
  },
};

export default DonateForm;