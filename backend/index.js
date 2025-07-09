const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios"); // Import axios to make HTTP requests


const authRoutes = require("./route/auth");
const Farmerregister = require("./route/farmer_registaition");
const Order = require("./route/order");

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(Farmerregister);
app.use(Order);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));


// Routes
app.use("/api/auth", authRoutes); // New authentication

// New Route for AI Integration
app.post("/api/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Send the request to the Python AI service
    const response = await axios.post("http://localhost:5000/generate", {
      prompt,
    });

    // Return the AI-generated text back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with AI service:", error);
    res.status(500).send("An error occurred while generating text.");
  }
});