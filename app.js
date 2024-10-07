const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./route/Routes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection (use environment variable or default to localhost)
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/resumeDB";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Use the routes from routes.js
app.use("/", routes);

// Start the server on dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
