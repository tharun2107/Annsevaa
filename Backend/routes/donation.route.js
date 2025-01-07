const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  postDonation,
  deleteDonation,
  acceptDonation,
  assignVolunteer,
  getDonations,
  donarAccept,
  
  updateDonationStatus,
  markAsSelfVolunteer,
  confirmPickup,
  needVolunteer,
  DonationPickedByVolunteer
} = require("../controllers/donation.controller");
const router = express.Router();

// Setup Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images')); // Specify the folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname.replaceAll(" ", ""))); // Generate a unique filename with extension
  },
});

const upload = multer({ storage: storage });

// for posting a donation in donor page
router.post("/", postDonation);

// for deleting donation when receiver declines the donation
router.delete("/:id", deleteDonation);

// receriver accepting the donation
router.put("/accept/:id", acceptDonation);

// if both donor and receiver request volunteer, and volunteer accepts or declines the donation
router.put("/volunteer/:id", assignVolunteer);

// for showing all the donations requiring a volunteer, to volunteer
router.get("/volunteer", getDonations);


router.get("/", donarAccept);

// Update donation status route
router.patch('/:id/status', updateDonationStatus);
// Mark as self volunteer route by donor updates as pickbydonor
router.patch('/donation/:id/self-volunteer', markAsSelfVolunteer);

//confirm status has completed by donar(food accepted by volunteer) when volunter had came  to donar (pick by receiver ==>  fulfilled)
router.patch('/:id/confirm', confirmPickup);

//donar requires a volunteer ==> needvolunteer : true
router.patch("/need-volunteer/:id",needVolunteer)



module.exports = router;
