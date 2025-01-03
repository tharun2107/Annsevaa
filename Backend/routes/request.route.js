const express = require("express");
const router = express.Router();
const {
  acceptDonation,
  getActiveRequests,
  deleteRequest,
  postRequest,
  get,
  getDonations
} = require("../controllers/request.controller");

// to display all the active requests and organizations to the donor
router.get("/", getActiveRequests);

// receiver making a request
router.post("/", postRequest);
router.post("/accept", acceptDonation);
// when receiver decides to stop a particular request.
// router.delete("/:id", deleteRequest);
router.get("/getDonation", getDonations);

module.exports = router;
