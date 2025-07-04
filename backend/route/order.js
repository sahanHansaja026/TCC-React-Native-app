const express = require("express");
const router = express.Router();
const multer = require("multer");
const Posts = require("../models/order");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/order/create/save",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const {
        product,
        quantity,
        price,
        availableUntil,
        location,
        groupSale,
        Discount,
        email,
      } = req.body;
      const imageFile = req.files?.image?.[0];

      const newPost = new Posts({
        product,
        quantity: Number(quantity),
        price: Number(price),
        Discount:Number(Discount),
        availableUntil: new Date(availableUntil),
        location,
        groupSale: groupSale === "true",
        email,
        image: imageFile
          ? {
              data: imageFile.buffer,
              contentType: imageFile.mimetype,
            }
          : null,
      });

      await newPost.save();
      return res.status(200).json({ success: "Order saved successfully" });
    } catch (error) {
      console.error("Error saving order:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

// Get all posts
router.get("/get/orders", async (req, res) => {
  try {
    const posts = await Posts.find().sort({ _id: -1 }).exec();

    const formattedPosts = posts.map((post) => {
      const postObject = post.toObject();
      if (post.image && post.image.data) {
        postObject.image = `data:${
          post.image.contentType
        };base64,${post.image.data.toString("base64")}`;
      } else {
        postObject.image = null;
      }
      return postObject;
    });

    return res.status(200).json({
      success: true,
      existingPosts: formattedPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
});

// Get orders by email
router.get("/get/email", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const posts = await Posts.find({ email }).sort({ _id: -1 }).exec();

    const formattedPosts = posts.map((post) => {
      const postObject = post.toObject();
      if (post.image && post.image.data) {
        postObject.image = `data:${
          post.image.contentType
        };base64,${post.image.data.toString("base64")}`;
      } else {
        postObject.image = null;
      }
      return postObject;
    });

    return res.status(200).json({
      success: true,
      existingPosts: formattedPosts,
    });
  } catch (error) {
    console.error("Error fetching posts by email:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
});


module.exports = router;
