const errorHandler = require("express-async-handler");
const Donation = require("../models/donation.model");
const mongoose = require("mongoose");
 
const User = require("../models/user.model");
const Request = require("../models/request.model");
 
const path = require("path");

const postDonation = errorHandler(async (req, res) => {
  const { quantity, receiverId, shelfLife, location } = req.body;

  try {
    const user = req.user;
    const donorId = user.id;

    let receiverObjectId = null;

    // Convert receiverId to ObjectId if provided
    if (receiverId) {
      if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ msg: "Invalid receiverId" });
      }
      receiverObjectId = new mongoose.Types.ObjectId(receiverId);
    }

    let pictureUrl = null;
    if (req.file) {
      pictureUrl = path.join("/images", req.file.filename);
    }

    const newDonation = new Donation({
      donorId,
      location,
      quantity,
      shelfLife,
      receiverId: receiverObjectId, // Use the converted ObjectId
      needVolunteer: false,
      pictureUrl,
    });

    const savedDonation = await newDonation.save();

    res.status(201).json({ msg: "Donation request sent successfully", savedDonation });
  } catch (err) {
    console.error("Error creating donation:", err);
    res.status(400).json({ msg: "Error creating donation", error: err.message });
  }
});
 
const deleteDonation = async (req, res) => {
  const donationId = req.params.id;
  try {
    const donation = await Donation.findByIdAndDelete(donationId);
    res.status(200).json({
      msg: "Donation deleted successfully",
      deletedDonation: donation,
    });
  } catch (error) {
    console.error("Error deleting donations:", error);
    res.status(500).json({ msg: "Error deleting donations", error });
  }
};

const acceptDonation = async (req, res) => {
  const { volunteer } = req.body; // Expecting a boolean value for 'volunteer'
  const donationId = req.params.id;

  try {
    // Find the donation by ID
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ msg: "Donation not found" });
    }

    // Update the status and needVolunteer fields
    donation.needVolunteer = donation.needVolunteer && volunteer;
    donation.status = donation.needVolunteer
      ? "assigning_volunteer"
      : "self_pickup";
    

      // updating existing requests of receiver
      const request = await Request.findOne({ receiverId: req.user.id });
      if(request.quantity - quantity <= 0) {
        const deletedRequest = await Request.findByIdAndDelete(request._id);
      } else {
        request.quantity = request.quantity - quantity;
        const updatedRequest = await request.save();
      }

    // Save the updated donation
    const updatedDonation = await donation.save();

    if (donation.status === "assigning_volunteer") {
      // send message to nearest volunteer and display these donations only in their page
      // *************************************
      // *****
      // *****         CODE
      // *****
      // *************************************
    }
    res.status(200).json({
      msg: "Donation updated successfully",
      updatedDonation,
    });
  } catch (error) {
    console.error("Error accepting donation:", error);
    res.status(500).json({ msg: "Error accepting donation", error });
  }
};

const assignVolunteer = async (req, res) => {
  const volunteerId = req.user._id;
  const donationId = req.params.id;

  try {
    const donation = await Donation.findById(donationId);
    donation.volunteerId = volunteerId;
    const updatedDonation = await donation.save();

    // send volunteer details to donor and receiver
    // *************************************
    // *****
    // *****         CODE
    // *****
    // *************************************

    res
      .status(200)
      .json({ msg: "Volunteer assigned successfully", updatedDonation });
  } catch (error) {
    console.error("Error assigning volunteer:", error);
    res.status(500).json({ msg: "Error assigning volunteer", error });
  }
};

const getDonations = async (req, res) => {
  try {
    const { lat, long } = req.body;

    if (!lat || !long) {
      return res
        .status(400)
        .json({ msg: "Current location (lat and long) is required" });
    }

    // Find donations near the provided current location (within 10km radius)
    const donations = await Donation.find({
      "location.lat": { $exists: true },
      "location.long": { $exists: true },
      status: "accepted",
    }).find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          $maxDistance: 5000, // 5km in meters
        },
      },
    });

    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ msg: "Error fetching donations", error });
  }
};

module.exports = {
  postDonation,
  deleteDonation,
  acceptDonation,
  getDonations,
  assignVolunteer,
};
