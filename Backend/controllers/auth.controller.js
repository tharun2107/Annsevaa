 
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const unirest = require('unirest');
const moment = require('moment');
const OtpVerificationModel = require('../models/otp.model');
const User = require('../models/user.model');

const FAST2SMS_API_KEY = process.env.FAST_SMS_API_KEY;
console.log(FAST2SMS_API_KEY)

// Utility to send OTP using Fast2SMS
function sendOtp(phone, otp) {
  return new Promise((resolve, reject) => {
    const response = unirest('GET', 'https://www.fast2sms.com/dev/bulkV2');
    
    // Build the query parameters
    response.query({
      authorization:FAST2SMS_API_KEY, // Use the API key from environment variable
      variables_values: otp,
      route: 'otp',
      numbers: phone,
    });

    // Set request headers
    response.headers({ 'cache-control': 'no-cache' });

    // Send the request
    response.end(function (res) {
      if (res.error) {
        console.error('Error sending OTP:', res.error);  // Log detailed error
        reject(res.error);
      } else {
        console.log('OTP sent successfully:', res.body); // Log success response
        resolve(res.body);
      }
    });
  });
}

// Send OTP
const sendOtpHandler = async (req, res) => {
  const { phone } = req.body;
  console.log('Received request body:', req.body);

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiryTime = moment().add(5, 'minutes').toDate(); // OTP valid for 5 minutes

  try {
    // Logging before update
    console.log('Updating OTP for phone number:', phone);
    
    const updateResult = await OtpVerificationModel.updateOne(
      { phone_number: phone },
      { otp: hashedOtp, expiry_time: expiryTime, created_at: new Date() },
      { upsert: true }
    );

    // Check if the update was successful
    console.log('Update result:', updateResult);

    if (updateResult.nModified === 0 && updateResult.upsertedCount === 0) {
      console.log('No OTP entry was updated or created.');
    } else {
      console.log('OTP entry updated or created successfully.');
    }

    // Send OTP via SMS (you should replace this with your actual SMS service)
    await sendOtp(phone, otp);
    
    // Response after sending OTP
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error occurred while sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
};


// Verify OTP
const verifyOtpHandler = async (req, res) => {
  const { phone, otp } = req.body;
console.log(req.body)
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    const otpRecord = await OtpVerificationModel.findOne({ phone_number: phone });

    if (!otpRecord) {
      return res.status(404).json({ message: 'OTP not found or expired' });
    }

    if (new Date() > otpRecord.expiry_time) {
      await OtpVerificationModel.deleteOne({ phone_number: phone });
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, delete it and log the user in
    await OtpVerificationModel.deleteOne({ phone_number: phone });
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error });
  }
};

// Register User
const registerHandler = async (req, res) => {
  const { name, phone, email, role, location } = req.body;

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    if (!location.landmark || !location.lat || !location.long) {
      return res.status(400).json({ message: 'Location details are required' });
    }

    const user = new User({ name, phone, email, role, location });
    await user.save();

    const token = jwt.sign({ id: user._id,role:role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token ,user,redirectUrl:`/${role}`});
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user', error });
  }
};

 
const loginHandler = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });
    // console.log(phone)
    // console.log("User retrieved from DB:", user); // Debug log for user

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
console.log("user id:",user._id)
const token = jwt.sign(
  { id: user._id, role: user.role }, // Add the necessary details here
  process.env.JWT_SECRET,
  { expiresIn: "5h" }
);
    let redirectUrl = '/dashboard';
    if (user.isAdmin === true) {
      redirectUrl = '/admin';
    } else if (user.role === 'donor') {
      redirectUrl = '/donor';
    } else if (user.role === 'receiver') {
      redirectUrl = '/receiver';
    } else if (user.role === 'volunteer') {
      redirectUrl = '/volunteer';
    }

    //console.log("Final Response Data:", { user, token, redirectUrl }); // Debug log for response data

    res.status(200).json({ message: 'Login successful', token, user, redirectUrl });
  } catch (error) { 
    console.error("Error in loginHandler:", error); // Log any errors
    res.status(500).json({ message: 'Failed to login', error });
  }
};

module.exports = { sendOtpHandler, verifyOtpHandler, registerHandler, loginHandler };
