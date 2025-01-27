  const mongoose = require("mongoose");

  const donationSchema = new mongoose.Schema(
    {
      donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      location: {
        landmark: { type: String, required: true },
        lat: { type: Number, required: true },
        long: { type: Number, required: true },
      },
      quantity: { type: Number, required: true },
      status: {
        type: String,
        // enum: ["pending", "assigning_volunteer", "volunteer_assigned", "self_pickup", "collected", "delivered"],
        // enum: ["pending", "approved","pickby", "completed"],
        enum: ["pending", "approved", "pickby", "completed", "pickbyreceiver", "pickbydonor", "requestacceptedbyvolunteer","pickbyvolunteer","rejected"], // Add possible dynamic statuses here
        default: "pending",
      },
      shelfLife: { type: Number, required: true },
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      needVolunteer: { type: Boolean, default: false },
      volunteerId: { type:mongoose.Schema.Types.ObjectId ,ref: "User",default:null },
      pictureUrl: { type: String },
      isReceiverRequest: {
        type: Boolean,
        default: false
      }

    },
    { 
      timestamps: true,
    }
  );

  // Check if the model is already defined, if not, define it
  module.exports = mongoose.models.Donation || mongoose.model("Donation", donationSchema);
