 
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const unirest = require('unirest');
const moment = require('moment');
const User = require('../models/user.model');

const FAST2SMS_API_KEY = process.env.FAST_SMS_API_KEY;
console.log(FAST2SMS_API_KEY)

// Register handler (password-based)
const registerHandler = async (req, res) => {
  console.log('Register endpoint called. Request body:', req.body);
  const { name, email, phone, password, location, role } = req.body;
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      location,
      role,
    });
    await user.save();
    // Generate JWT token after registration
    const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });
    // Exclude password from user object
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ message: 'User registered successfully', token, user: userObj });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login handler (password-based)
const loginHandler = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password' });
    }
    const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = { registerHandler, loginHandler };
