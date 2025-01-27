// controllers/donationHistoryController.js

const Donation = require("../models/donation.model");
const User = require("../models/user.model");
const ReceiverRequest = require("../models/request.model");

// Fetch donor history
const donorHistory = async (req, res) => {
    try {
      console.log("Request User:", req.user); // Verify user data
      if (!req.user || !req.user.id) {
        return res.status(400).json({ error: "User not authenticated or ID missing" });
      }
      const donations = await Donation.find({
        donorId: req.user.id,
        status: "completed",
      })
        .populate("volunteerId", "name phone location")
        .populate("donorId", "name phone location")
        .populate("receiverId", "name phone location");
  
      console.log("Donations with populated volunteerId:", donations); // Check donations in the log
  
      // Pass the donations to the fetchReceiverDetails function
      const response = await fetchReceiverDetails(donations);
  
      res.status(200).json(response);
    } catch (err) {
      console.error("Error fetching donor history:", err);
      res.status(500).json({ error: err.message });
    }
  };


// Fetch receiver history
const receiverHistory = async (req, res) => {
  try {
    const donations = await Donation.find({
      receiverId: req.user.id,
      status: "completed",
    })
      .populate("volunteerId", "name phone location")
      .populate("donorId", "name phone location");

    const response = await fetchReceiverDetails(donations);

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching receiver history:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch volunteer history
const volunteerHistory = async (req, res) => {
  try {
    const donations = await Donation.find({
      volunteerId: req.user.id,
      status: "completed",
    })
      .populate("volunteerId", "name phone location")
      .populate("donorId", "name phone location");

    const response = await fetchReceiverDetails(donations);

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching volunteer history:", err);
    res.status(500).json({ error: err.message });
  }
};

// Helper function to fetch receiver details
const fetchReceiverDetails = async (donations) => {
  return await Promise.all(
    donations.map(async (donation) => {
      let receiverDetails = null;
      let volunteerDetails = null;

      // Fetch receiver details
      if (donation.receiverId) {
        const receiverRequest = await ReceiverRequest.findById(donation.receiverId)
          .populate("receiverId", "name phone location")
          .select("receiverId");

        if (receiverRequest && receiverRequest.receiverId) {
          receiverDetails = receiverRequest.receiverId;
        } else {
          const user = await User.findById(donation.receiverId).select("name phone location");
          if (user) receiverDetails = user;
        }
      }

      // Fetch volunteer details
      if (donation.volunteerId) {
        const volunteer = await User.findById(donation.volunteerId).select("name phone location");
        if (volunteer) volunteerDetails = volunteer;
      }

      // Return donation details including the populated volunteer and receiver data
      return {
        donationId: donation._id,
        donor: donation.donorId || "Donor information unavailable",
        volunteer: volunteerDetails || "Volunteer information unavailable",
        receiver: receiverDetails || "Receiver information unavailable",
        donationDetails: {
          quantity: donation.quantity,
          status: donation.status,
          location: donation.location,
          createdAt: donation.createdAt,
        },
      };
    })
  );
};

module.exports = { donorHistory, receiverHistory, volunteerHistory };
