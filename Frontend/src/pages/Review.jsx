import React, { useEffect, useState } from "react";
import axios from "axios";

const Review = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ review: "", rating: 1 });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ review: "", rating: 1 });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/review");
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login first");
      return;
    }

    try {
      const payload = {
        userId: currentUser._id,
        userName: currentUser.name,
        review: newReview.review,
        rating: Number(newReview.rating),
      };
      const res = await axios.post("http://localhost:5001/api/review", payload);
      setReviews([res.data, ...reviews]);
      setNewReview({ review: "", rating: 1 });
    } catch (err) {
      console.error("Failed to add review", err);
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditingData({ review: review.review, rating: review.rating });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({ review: "", rating: 1 });
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
        userId: currentUser._id,
        review: editingData.review,
        rating: Number(editingData.rating),
      };
      const res = await axios.put(`http://localhost:5001/api/review/${id}`, payload);
      setReviews(reviews.map(r => (r._id === id ? res.data : r)));
      cancelEdit();
    } catch (err) {
      console.error("Failed to update review", err);
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/review/${id}`, {
        data: { userId: currentUser._id },
      });
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {currentUser ? (
        <>
          {/* New Review Form */}
          <form onSubmit={handleAddReview} className="mb-6">
            <textarea
              required
              placeholder="Write your review..."
              value={newReview.review}
              onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
              className="w-full p-2 border rounded mb-2"
            />
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview(prev => ({ ...prev, rating: e.target.value }))}
              className="mb-2"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <br />
            <button type="submit" className="btn btn-primary">Add Review</button>
          </form>

          {/* Reviews List */}
          <ul>
            {reviews.map((r) => (
              <li key={r._id} className="mb-4 border p-4 rounded shadow">
                <p className="font-semibold">{r.userName} says:</p>

                {editingId === r._id ? (
                  <>
                    <textarea
                      value={editingData.review}
                      onChange={(e) =>
                        setEditingData(prev => ({ ...prev, review: e.target.value }))
                      }
                      className="w-full p-2 border rounded mb-2"
                    />
                    <select
                      value={editingData.rating}
                      onChange={(e) =>
                        setEditingData(prev => ({ ...prev, rating: e.target.value }))
                      }
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>
                          {num} Star{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    <br />
                    <button onClick={() => saveEdit(r._id)} className="btn btn-success mr-2">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="btn btn-secondary">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{r.review}</p>
                    <p>Rating: {r.rating} ⭐</p>

                    {r.userId === currentUser._id && (
                      <div className="mt-2">
                        <button onClick={() => startEdit(r)} className="btn btn-warning mr-2">
                          Edit
                        </button>
                        <button onClick={() => deleteReview(r._id)} className="btn btn-danger">
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Please login to add and manage your reviews.</p>
      )}
    </div>
  );
};

export default Review;
