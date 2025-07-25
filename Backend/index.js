const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

// const upload = require("./utils/multerconfig.js")

const app = express();
const PORT = 3001;

const errorHandler = require("./middleware/errorHandling.js");
const path = require("path");
const { adminAuth } = require("./middleware/adminAuth.js");
const { validateToken } = require("./middleware/validateToken");

const authRoutes = require("./routes/auth.route.js");
const adminRoutes = require("./routes/admin.route.js");
const requestRoutes = require("./routes/request.route.js");
const donationRoutes = require("./routes/donation.route.js");
const userRoutes = require("./routes/user.route.js");
const volunteerRoutes = require("./routes/volunteer.route.js");
const historyRoutes = require("./routes/donationHistoryRoutes.js");
const metrics = require("./routes/metrics.route.js");

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB
const url = process.env.MONGO_URL;
mongoose.connect(url)
  .then(() => console.log("Connected to Database successfully..."))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Optionally exit the process if DB connection fails
  });

// Serve static images
app.use("/images", express.static(path.join(__dirname, "images")));
// console.log(path.join(__dirname,'images'))

// Authentication Routes (open to all)
app.use("/api/auth", authRoutes);

// Apply validateToken middleware for protected routes
app.use("/api/user",validateToken(["donor", "receiver", "volunteer"]),userRoutes);
app.use("/api/requests", validateToken(["receiver"]), requestRoutes);
app.use("/api/donation", validateToken(["donor"]), donationRoutes);
app.use("/api/volunteer", validateToken(["volunteer"]), volunteerRoutes); // Only volunteers can access this route
// app.use("/api/history", historyRoutes); // Only donors and receivers can access this route
app.use("/api/metrics", metrics); // Assuming metrics route doesn't require role-based validation
app.use(
  "/api/history",
  validateToken(["donor", "receiver", "volunteer"]),
  historyRoutes
);

// Admin Routes (apply adminAuth for restricted access)
// app.use("/admin", validateToken, adminAuth, adminRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log("url",process.env.MONGO_URL)
  console.log(`Proxy server listening at http://localhost:${PORT}`);
});
