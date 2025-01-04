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

  const deletedRequest = async (req, res) => {
    const requestId = Request.findById(req.params.id);
    try {
      const request = Request.findByIdAndDelete(requestId);
      res.status(200).json({ msg: "Request successfully deleted", deletedRequest: request });
    } catch (error) {
      res.status(400).json({ msg: "Failed to delete the request", error });
    }
  };


const acceptDonation = async (req, res) => {
  const { donationId ,isAccept} = req.body;
  console.log(donationId)
  try {
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ msg: "Donation not found" });
    }
      isAccept = true;
    res.json({msg:"Donar Donated Successfully",donation,isAccept});


  }
  catch (error) {
    res.status(400).json({ msg: "Error accepting donation", error });
  }
}
  module.exports = {
    postRequest,
    getActiveRequests,
    deletedRequest,
    acceptDonation,
    getDonations
  };
