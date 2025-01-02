  const Request = require("../models/request.model");
const User = require("../models/user.model");
  const postRequest = async (req, res) => {
    const { quantity } = req.body;
    console.log(req.body);

    try {
      const newRequest = new Request({
        receiverId: req.user.id,
        quantity,
      });
      console.log(newRequest);

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
      const organizations = await User.find({ role: "receiver" ,isActive: true});
  
      // Log the results to ensure they are retrieved correctly
      console.log("Requests:", requests);
      console.log("Organizations:", organizations);
  
      res
        .status(200)
        .json({ msg: "Retrieved Active requests successfully", requests });
    } catch (error) {
      console.error("Error finding requests:", error); // Add detailed logging for debugging
      res.status(400).json({ msg: "Error finding requests", error });
    }
  };
  

  const deletedRequest = async (req, res) => {
    const requestId = Request.findById(req.params.id);
    try {
      const request = Request.findByIdAndDelete(requestId);
      res.status(200).json({ msg: "Request successfully deleted", deletedRequest: request });
    } catch (error) {
      res.status(400).json({ msg: "Failed to delete the request", error });
    }
  };

  module.exports = {
    postRequest,
    getActiveRequests,
    deletedRequest,
  };
