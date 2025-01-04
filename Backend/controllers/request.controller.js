const Request = require("../models/request.model");
const User = require("../models/user.model");
const Donation = require("../models/donation.model");
 


const postRequest = async (req, res) => {
    const { quantity } = req.body;
    console.log(req.body);

  try {
    const user = await User.findById(req.user.id);
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handle user not found
  }
  const newRequest = new Request({
    receiverId: req.user.id, // Receiver ID (donor's ID or recipient's ID)
    receiverName: user.name, // Assuming `user.name` is available
    receiverPhone: user.phone, // Assuming `user.phone` is available
    receiverAddress: user.location.landmark, // Assuming `user.address` is available
    receiverLocation: {
        name: user.location.landmark, // Assuming `user.locationName` is available
        lat: user.location.lat,   // Assuming `user.locationLat` is available
        long: user.location.long, // Assuming `user.locationLong` is available
    },
    quantity, // Quantity from the request payload
});
      console.log("new Request",  newRequest);

      const savedRequest = await newRequest.save();
      res
        .status(201)
        .json({ msg: "Request added successfully", request: savedRequest });
    } catch (error) {
      res.status(400).json({ msg: "Error creating request", error });
    }
  };

  const getActiveRequests = async (req, res) => {
    try {
      // Await the results of the database queries
      const requests = await Request.find();
      //console.log(requests);
      const organizations = await User.find({ role: "receiver" ,isActive: true});
  
      // Log the results to ensure they are retrieved correctly
      console.log("Requests:", requests);
      console.log("Organizations:", organizations);
  
      res
        .status(200)
        .json({ msg: "Retrieved Active requests successfully", requests,organizations });
    } catch (error) {
      console.error("Error finding requests:", error); // Add detailed logging for debugging
      res.status(400).json({ msg: "Error finding requests", error });
    }
  };
  
  const getDonations = async (req, res) => {
    // const { user } = req.body;  
    // console.log(user);
    console.log(req.user)
    try {
        const donation = await Donation.find({ donorId: req.user.id, status: "pending" });
        
        if (!donation || donation.length === 0) {
            return res.status(404).json("Donation not available");
        }
        res.status(200).json(donation);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
 

    const savedRequest = await newRequest.save();
    res.status(200).json({ msg: "Request Sent successfully", request: savedRequest });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(400).json({ msg: "Error creating request", error });
  }
};

// Get all active requests and organizations
// const getActiveRequests = async (req, res) => {
//   try {
//     const requests = await Request.find();
//     const organizations = await User.find({ role: "receiver", isActive: true });

//     res.status(200).json({
//       msg: "Retrieved Active requests successfully",
//       requests,
//       organizations,
//     });
//   } catch (error) {
//     console.error("Error finding requests:", error);
//     res.status(400).json({ msg: "Error finding requests", error });
//   }
// };

// Delete a request by ID
const deletedRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    res.status(200).json({ msg: "Request successfully deleted", deletedRequest: request });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(400).json({ msg: "Failed to delete the request", error });
  }
};

// Fetch active donation details for a receiver
const getActiveDonation = async (req, res) => {
  try {
    // Fetch the donation and populate donor details
    const donation = await Donation.findOne({ receiverId: req.user.id,status: "pending" }) //
      .populate("donorId", "name phone location");

    if (!donation) {
      return res.status(404).json({ msg: "Donation not found" });
    }

    // Return the donation along with donor details
    res.json({
      msg: "Donor's donation details fetched successfully",
      donation,
    });
  } catch (error) {
    console.error("Error fetching active donation:", error);
    res.status(500).json({ msg: "Error fetching donation details", error });
  }
};



// Accept donation and set self-volunteer flag
  // const acceptDonation = async (req, res) => {
  //   const { approveDonation, acceptasVolunteer } = req.body;

  //   try {
  //     if (approveDonation === undefined || acceptasVolunteer === undefined) {
  //       return res.status(400).json({ message: "Both approveDonation and acceptasVolunteer are required" });
  //     }

  //     const donation = await Donation.findOne({ receiverId: req.user.id });

  //     if (!donation) {
  //       return res.status(404).json({ msg: "Donation not found" });
  //     }

  //     donation.approveDonation = approveDonation;
  //     donation.needVolunteer = acceptasVolunteer;
  //     donation.status = "pickby";
  //     await donation.save();

  //     res.json({
  //       msg: "Donation status updated successfully",
  //       updatedDonation: {
  //         approveDonation: donation.approveDonation,
  //         acceptasVolunteer: donation.acceptasVolunteer,
  //       },
  //     });
  //   } catch (err) {
  //     console.error("Error updating donation status:", err);
  //     res.status(500).json({ message: "Internal server error", error: err });
  //   }
  // };
  const acceptDonation = async (req, res) => {
    const { approveDonation, acceptasVolunteer } = req.body;
  
    try {
      if (approveDonation === undefined || acceptasVolunteer === undefined) {
        return res.status(400).json({ message: "Both approveDonation and acceptasVolunteer are required" });
      }
  
      // Find the donation related to the receiver
      const donation = await Donation.findOne({ receiverId: req.user.id });
  
      if (!donation) {
        return res.status(404).json({ msg: "Donation not found" });
      }
  
      // Update donation details
      if (approveDonation) {
        donation.status = "approved"; // Receiver approves the donation
      }
  
      if (acceptasVolunteer) {
        donation.needVolunteer = false;
        donation.status = "pickbyreceiver"; // Receiver needs a volunteer
      }else{
        donation.needVolunteer = true;
      }
  
      // Determine the role of the actor (donor, receiver, or volunteer)
      // if (req.user.id === donation.donorId) {
      //   donation.status = "pickbydonor"; // If the donor takes action
      // } else if (req.user.id === donation.receiverId) {
      //   donation.status = "pickbyreceiver"; // If the receiver takes action
      // } else if (req.user.id === donation.volunteerId) {
      //   donation.status = "pickbyvolunteer"; // If the volunteer takes action
      // }
  
      // If a volunteer is assigned, update the volunteerId
      if (req.body.volunteerId && req.body.volunteerId !== donation.volunteerId) {
        donation.volunteerId = req.body.volunteerId;
      }
  
      // Save the updated donation status
      await donation.save();
  
      res.status(200).json({
        msg: "Donation status updated successfully",
        updatedDonation: {
          status: donation.status,
          volunteerId: donation.volunteerId,
          needVolunteer: donation.needVolunteer,
        },
      });
    } catch (err) {
      console.error("Error updating donation status:", err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  };

  const rejectDonation = async (req, res) => {
    const { donationId } = req.body;
  
    try {
      // Find the donation by ID
      const donation = await Donation.findById(donationId);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
  
      // Update the status to "rejected"
      donation.status = "rejected";
      await donation.save();
  
      res.status(200).json({ message: "Donation rejected successfully", donation });
    } catch (err) {
      console.error("Error rejecting donation:", err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  };
  
  
module.exports = {
  postRequest,
  getActiveRequests,
  deletedRequest,
  getActiveDonation,
  acceptDonation,
  rejectDonation,
};
