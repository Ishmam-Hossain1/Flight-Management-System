import Review from "../models/review.js";

// GET all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
};

// POST a new review
export const createReview = async (req, res) => {
  const { userId, userName, review, rating } = req.body;

  try {
    const newReview = new Review({
      userId,
      userName,
      review,
      rating,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Create review error:", err);
    res.status(400).json({ message: "Failed to create review", error: err.message });
  }
};

// PUT (update) a review — only if user is the author
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { userId, review, rating } = req.body;

  try {
    const existingReview = await Review.findById(id);
    if (!existingReview) return res.status(404).json({ message: "Review not found" });

    if (existingReview.userId.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized to edit this review" });

    existingReview.review = review;
    existingReview.rating = rating;

    const updatedReview = await existingReview.save();
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: "Failed to update review", error: err.message });
  }
};

// DELETE a review — only if user is the author
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const existingReview = await Review.findById(id);
    if (!existingReview) return res.status(404).json({ message: "Review not found" });

    if (existingReview.userId.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized to delete this review" });

    await existingReview.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review", error: err.message });
  }
};
