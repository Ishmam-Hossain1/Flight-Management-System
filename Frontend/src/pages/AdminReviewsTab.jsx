// src/pages/AdminReviewsTab.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const AdminReviewsTab = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    review: "",
    rating: 1,
  });

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle input change (for editing)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "rating" ? Number(value) : value });
  };

  // Handle update review
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5001/api/admin/reviews/${editingId}`,
        formData
      );
      setReviews(reviews.map(r => (r._id === editingId ? res.data : r)));
      setEditingId(null);
    } catch (err) {
      console.error("Update review error:", err);
    }
  };

  // Start editing a review
  const handleEdit = (review) => {
    setFormData({
      userName: review.userName,
      review: review.review,
      rating: review.rating,
    });
    setEditingId(review._id);
  };

  // Delete a review
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>

      {/* Edit Form */}
      {editingId && (
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">User Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Review</label>
            <input
              type="text"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              required
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min={1}
              max={5}
              required
              className="border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update Review
          </button>
        </form>
      )}

      {/* Review List */}
      <ul className="space-y-2">
        {reviews.map(r => (
          <li
            key={r._id}
            className="flex justify-between border p-2 items-center"
          >
            <div>
              <span className="font-semibold">{r.userName}</span> | ⭐ {r.rating} | "{r.review}"
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(r)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(r._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReviewsTab;
