// const Donation = require("../models/donation.model");
// const ReceiverRequest = require("../models/request.model"); // Assuming the ReceiverRequest model is named "request.model"
// const User = require("../models/user.model"); // Assuming the User model is named "user.model"

// const volunteer = async (req, res) => {
//   try {
//     // Fetch donations where needVolunteer is true
//     const donations = await Donation.find({ needVolunteer: true }).populate([
//       { path: "donorId", select: "name phone location" }, // Populate donor details
//     ]);

//     if (!donations || donations.length === 0) {
//       return res.status(404).json({ message: "No donations require a volunteer." });
//     }

//     // Fetch receiver details based on receiverRequestId from the ReceiverRequest model
//     const response = await Promise.all(
//       donations.map(async (donation) => {
//         // Fetch receiverRequest using receiverRequestId
//         const receiverRequest = await ReceiverRequest.findById(donation.receiverId)
//           .populate("receiverId", "name phone location") // Populate receiverId to get user details
//           .select("receiverId");

//         // If receiverRequest is found, get receiver details, otherwise handle it
//         const receiverDetails = receiverRequest && receiverRequest.receiverId
//           ? {
//               name: receiverRequest.receiverId.name,
//               phone: receiverRequest.receiverId.phone,
//               location: receiverRequest.receiverId.location,
//             }
//           : "Receiver information unavailable";

//         return {
//           donationId: donation._id,
//           donor: donation.donorId
//             ? {
//                 name: donation.donorId.name,
//                 phone: donation.donorId.phone,
//                 location: donation.donorId.location,
//               }
//             : "Donor information unavailable",
//           receiver: receiverDetails,
//           donationDetails: {
//             quantity: donation.quantity,
//             status: donation.status,
//             shelfLife: donation.shelfLife,
//             location: donation.location,
//             pictureUrl: donation.pictureUrl,
//             createdAt: donation.createdAt,
//           },
//         };
//       })
//     );

//     // Send the response
//     res.status(200).json(response);
//   } catch (err) {
//     console.error("Error fetching volunteer data:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   volunteer,
// };

const Donation = require("../models/donation.model");
const ReceiverRequest = require("../models/request.model"); // Assuming the ReceiverRequest model is named "request.model"
const User = require("../models/user.model"); // Assuming the User model is named "user.model"

const volunteer = async (req, res) => {
  try {
    // Fetch donations where needVolunteer is true
    const donations = await Donation.find({ needVolunteer: true }).populate([
      { path: "donorId", select: "name phone location" }, // Populate donor details
    ]);

    if (!donations || donations.length === 0) {
      return res
        .status(404)
        .json({ message: "No donations require a volunteer." });
    }

    // Fetch receiver details based on receiverRequestId from the ReceiverRequest model or User model for fixed organizations
    const response = await Promise.all(
      donations.map(async (donation) => {
        let receiverDetails = null;

        // Check if the receiverId in donation refers to a ReceiverRequest or a fixed organization (User)
        if (donation.receiverId) {
          // If the receiverId is a ReceiverRequest, fetch the details from ReceiverRequest
          const receiverRequest = await ReceiverRequest.findById(
            donation.receiverId
          )
            .populate("receiverId", "name phone location") // Populate receiverId (user details)
            .select("receiverId");

          // If a receiverRequest is found, get receiver details
          if (receiverRequest && receiverRequest.receiverId) {
            receiverDetails = {
              name: receiverRequest.receiverId.name,
              phone: receiverRequest.receiverId.phone,
              location: receiverRequest.receiverId.location,
            };
          }
        }

        // If receiverDetails is still null, it means it's a fixed organization (User model)
        if (!receiverDetails) {
          // Fetch the fixed organization user details using receiverId (directly in User model)
          const organization = await User.findById(donation.receiverId).select(
            "name phone location"
          );

          if (organization) {
            receiverDetails = {
              name: organization.name,
              phone: organization.phone,
              location: organization.location,
            };
          }
        }

        return {
          donationId: donation._id,
          donor: donation.donorId
            ? {
                name: donation.donorId.name,
                phone: donation.donorId.phone,
                location: donation.location,
              }
            : "Donor information unavailable",
          receiver: receiverDetails || "Receiver information unavailable",
          donationDetails: {
            quantity: donation.quantity,
            status: donation.status,
            shelfLife: donation.shelfLife,
            location: donation.location,
            pictureUrl: donation.pictureUrl,
            createdAt: donation.createdAt,
          },
        };
      })
    );

    // Send the response
    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching volunteer data:", err);
    res.status(500).json({ error: err.message });
  }
};

const getCurrentAcceptedDonation = async (req, res) => {
  const volunteerId = req.user.id; // Assuming middleware attaches the user ID to `req.user.id`

  try {
    // Query to find the donation with status 'requestacceptedbyvolunteer' and the current volunteer
    const donation = await Donation.findOne({
      status: "requestacceptedbyvolunteer",
      volunteerId: volunteerId, // Ensure this field is populated when a volunteer accepts a donation
    });

    if (!donation) {
      return res
        .status(404)
        .json({ message: "No currently accepted donations found." });
    }

    // Fetch donor details
    const donorDetails = await User.findById(donation.donorId).select(
      "name phone location"
    );

    // Fetch receiver details
    let receiverDetails = null;

    if (donation.receiverId) {
      const receiverRequest = await ReceiverRequest.findById(
        donation.receiverId
      )
        .populate("receiverId", "name phone location") // Populate receiver details
        .select("receiverId");

      if (receiverRequest && receiverRequest.receiverId) {
        receiverDetails = {
          name: receiverRequest.receiverId.name,
          phone: receiverRequest.receiverId.phone,
          location: receiverRequest.receiverId.location,
        };
      } else {
        const organization = await User.findById(donation.receiverId).select(
          "name phone location"
        );
        if (organization) {
          receiverDetails = {
            name: organization.name,
            phone: organization.phone,
            location: organization.location,
          };
        }
      }
    }

    // Prepare response
    res.status(200).json({
      donation: {
        id: donation._id,
        status: donation.status,
        location: donation.location || {}, // Includes location details
        donor: donorDetails
          ? {
              name: donorDetails.name,
              phone: donorDetails.phone,
              location: donorDetails.location,
            }
          : "Donor information unavailable",
        receiver: receiverDetails || "Receiver information unavailable",
      },
    });
  } catch (err) {
    console.error("Error fetching current accepted donation:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch current accepted donation." });
  }
};

//volunteer accepted donation
const acceptDonationByVolunteer = async (req, res) => {
  const { id } = req.params; // Get donationId from request body
  //console.log("Donation ID received:", id); // Debugging log
  console.log("ID:" + id);
  try {
    const donation = await Donation.findByIdAndUpdate(
      id,
      {
        status: "requestacceptedbyvolunteer",
        needVolunteer: false, // Include all fields to update in one object
        volunteerId: req.user.id, // Update volunteerId with the current user's id
      },
      { new: true } // Return the updated donation
    );

    console.log("donation:" + donation);

    res
      .status(200)
      .json({ message: "Donation accepted successfully.", donation });
  } catch (err) {
    console.error("Error accepting donation:", err);
    res.status(500).json({ error: err.message });
  }
};

const DonationPickedByVolunteer = async (req, res) => {
  const { id } = req.params; // Get donationId from request body
  //console.log("Donation ID received:", id); // Debugging log
  console.log(id);
  try {
    const donation = await Donation.findByIdAndUpdate(
      id,
      {
        status: "pickbyvolunteer",
        needVolunteer: false,
      },
      { new: true }
    );
    console.log(donation);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found." });
    }

    res.status(200).json({ message: "Food picked successfully.", donation });
  } catch (err) {
    console.error("Error picking  donation:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  volunteer,
  getCurrentAcceptedDonation,
  acceptDonationByVolunteer,
  DonationPickedByVolunteer,
};
