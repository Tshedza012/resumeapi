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
// MongoDB connection (use environment variable or default to localhost)
const mongoURI =  "mongodb+srv://tshedzamudau759:r1HhPNSNQ6Q6YFih@cluster0.irf6l.mongodb.net/resumeDB?retryWrites=true&w=majority";
mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 20000, // Increase the timeout to 20 seconds
  })
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
