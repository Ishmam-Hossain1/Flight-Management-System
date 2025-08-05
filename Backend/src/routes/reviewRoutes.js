import express from "express";
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getAllReviews);             // View all reviews
router.post("/", createReview);            // Add new review
router.put("/:id", updateReview);          // Update own review
router.delete("/:id", deleteReview);       // Delete own review

export default router;
