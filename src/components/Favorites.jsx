import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styling.css"; // Ensure CSS styling matches the jobs list

function Favorites() {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];

      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const responses = await Promise.all(
          favoriteIds.map((jobId) =>
            axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`)
          )
        );
        setFavoriteJobs(responses.map((res) => res.data));
      } catch (err) {
        setError("Failed to load favorite jobs.");
        console.error("Error fetching favorite jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteJobs();
  }, []);

  const removeFavorite = (jobId) => {
    const updatedFavorites = favoriteJobs.filter((job) => job._id !== jobId);
    setFavoriteJobs(updatedFavorites);
    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites.map((job) => job._id))
    );
  };

  return (
    <div className="favorites-container">
      <h2>My Favorite Jobs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : favoriteJobs.length > 0 ? (
        favoriteJobs.map((job) => (
          <div key={job._id} className="job-section">
            <h4>{job.title}</h4>
            <p>
              <strong>Company:</strong> {job.company}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Salary:</strong>{" "}
              {job.salary ? `$${job.salary}` : "Not specified"}
            </p>
            <p>
              <strong>Description:</strong> {job.description}
            </p>
            <p>
              <strong>Requirements:</strong>
            </p>
            <ul>
              {job.requirements && job.requirements.length > 0 ? (
                job.requirements.map((req, index) => <li key={index}>{req}</li>)
              ) : (
                <li>No specific requirements</li>
              )}
            </ul>
            <button
              className="remove-btn"
              onClick={() => removeFavorite(job._id)}
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>No favorite jobs yet.</p>
      )}
    </div>
  );
}

export default Favorites;
