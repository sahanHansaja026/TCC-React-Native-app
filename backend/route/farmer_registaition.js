const express = require("express");
const Posts = require("../models/farmer"); // Your Farmer model
const router = express.Router();
const multer = require("multer");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post(
  "/farmer/save",
  upload.fields([{ name: "profileimage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, email, address, nicnumber, selectedDistrict, contact } =
        req.body;
      const imageFile = req.files.profileimage?.[0];

      const newPost = new Posts({
        name,
        email,
        address,
        nicnumber,
        selectedDistrict,
        contact,
        profileimage: imageFile
          ? {
              data: imageFile.buffer,
              contentType: imageFile.mimetype,
            }
          : null,
      });

      await newPost.save();
      return res.status(200).json({ success: "Profile saved successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

router.post(
  "/farmer/updateOrSave",
  upload.fields([{ name: "profileimage", maxCount: 1 }]),
  async (req, res) => {
    const { email, name, nicnumber, address, selectedDistrict, contact } =
      req.body;
    const imageFile = req.files.profileimage?.[0];

    try {
      const existing = await Posts.findOne({ email });

      if (existing) {
        existing.name = name;
        existing.nicnumber = nicnumber;
        existing.address = address;
        existing.selectedDistrict = selectedDistrict;
        existing.contact = contact;

        if (imageFile) {
          existing.profileimage = {
            data: imageFile.buffer,
            contentType: imageFile.mimetype,
          };
        }

        await existing.save();
        res.json({ message: "Farmer data updated" });
      } else {
        const newFarmer = new Posts({
          email,
          name,
          nicnumber,
          address,
          selectedDistrict,
          contact,
          profileimage: imageFile
            ? {
                data: imageFile.buffer,
                contentType: imageFile.mimetype,
              }
            : null,
        });

        await newFarmer.save();
        res.json({ message: "Farmer registered" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/farmer/getByEmail/:email", async (req, res) => {
  try {
    const farmer = await Posts.findOne({ email: req.params.email });

    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    const result = farmer.toObject();

    if (farmer.profileimage?.data) {
      result.profileimage = {
        contentType: farmer.profileimage.contentType,
        base64: farmer.profileimage.data.toString("base64"),
      };
    } else {
      result.profileimage = null;
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
