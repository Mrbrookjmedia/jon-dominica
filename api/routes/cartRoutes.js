// const express = require("express");
// const Cart = require("../models/cart.model"); // Import the Cart schema
// const authMiddleware = require("../middleware/authMiddleware"); // Middleware to check if the user is authenticated
// const router = express.Router();


// router.post("/add", authMiddleware, async (req, res) => {
//     const { productId, quantity } = req.body; // Get productId and quantity from request
//     const userId = req.user.id; // Extract the user ID from the authenticated request
  
//     try {
//       let cart = await Cart.findOne({ userId }); // Find the user's cart
//       if (!cart) {
//         // If no cart exists, create a new one
//         cart = new Cart({ userId, items: [] });
//       }
  
//       // Check if the product already exists in the cart
//       const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  
//       if (itemIndex > -1) {
//         // If item exists, update its quantity
//         cart.items[itemIndex].quantity += quantity;
//       } else {
//         // Otherwise, add the new product to the cart
//         cart.items.push({ productId, quantity });
//       }
  
//       await cart.save(); // Save the cart back to the database
//       res.status(200).json({ message: "Item added to cart", cart });
//     } catch (error) {
//       res.status(500).json({ error: "Error adding item to cart" });
//     }
//   });
  


//   router.get("/", authMiddleware, async (req, res) => {
//     const userId = req.user.id;
  
//     try {
//       const cart = await Cart.findOne({ userId }).populate("items.productId"); // Populate product details
//       if (!cart) {
//         return res.status(404).json({ message: "Cart is empty" });
//       }
//       res.status(200).json(cart);
//     } catch (error) {
//       res.status(500).json({ error: "Error fetching cart" });
//     }
//   });

  


//   router.delete("/clear", authMiddleware, async (req, res) => {
//     const userId = req.user.id;
  
//     try {
//       const cart = await Cart.findOneAndDelete({ userId });
//       if (!cart) {
//         return res.status(404).json({ message: "Cart not found" });
//       }
//       res.status(200).json({ message: "Cart cleared successfully" });
//     } catch (error) {
//       res.status(500).json({ error: "Error clearing cart" });
//     }
//   });

  

//   module.exports = router;


// routes/cartRoutes.js
import express from "express";
import { getCart, addToCart, clearCart, removeFromCart, updateCartItem} from "../controllers/cart.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import User from "../models/user.model.js";

const router = express.Router();

// All cart endpoints require authentication
router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.put("/update", verifyToken, updateCartItem);
router.delete("/remove/:productId", verifyToken, removeFromCart);
// router.post("/clear", verifyToken, async (req, res) => {
//     try {
//       const user = await User.findById(req.userId);
//       user.cart = { items: [] };
//       await user.save();
//       res.status(200).json({ message: "Cart cleared", cart: user.cart });
//     } catch (error) {
//       res.status(500).json({ message: "Error clearing cart" });
//     }
//   });

// router.delete("/clear", verifyToken, async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       { $set: { 'cart.items': [] } }, // Proper MongoDB update
//       { new: true }
//     );
//     res.status(200).json({ message: "Cart cleared", cart: user.cart });
//   } catch (error) {
//     res.status(500).json({ message: "Error clearing cart" });
//   }
// });

router.delete("/clear", verifyToken, clearCart);

export default router;
