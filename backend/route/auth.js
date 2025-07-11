const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const saltRounds = 10;
const secretKey = "secretkey";

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      "secretkey",
      { expiresIn: "12h" }
    );

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware to verify JWT
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "No token provided" });

  // ✅ Remove "Bearer " from the token string
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Token format invalid" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    req.userId = user._id;
    req.username = user.username;
    req.email = user.email;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ error: "Failed to authenticate token" });
  }
};


// Get User Data
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ username: req.username, email: req.email });
});

module.exports = router;
