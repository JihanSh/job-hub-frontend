import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styling.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user");
      console.log(userId)
      if (!token || !userId) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        navigate("/user-auth"); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/applications/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(response.data);
      } catch (err) {
        setError("Failed to fetch applications. Please try again.");
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  return (
    <div className="applications-container">
      <h2>My Applications</h2>

      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : applications.length > 0 ? (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <h3>{app.job.title}</h3>
              <p>
                <strong>Company:</strong> {app.job.company}
              </p>
              <p>
                <strong>Location:</strong> {app.job.location}
              </p>
              <p>
                <strong>Status:</strong> {app.status || "Pending"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
}

export default MyApplications;
