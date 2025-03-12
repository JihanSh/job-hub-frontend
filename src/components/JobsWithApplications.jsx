import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styling.css";

function JobsWithApplications() {
  const [jobs, setJobs] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("user"));
  const [error, setError] = useState(""); // For error handling

  useEffect(() => {
    // Log the userId and token to check if they are being set
    console.log("user:", localStorage.getItem("user"));
    console.log("Token:", localStorage.getItem("token"));

    if (!userId) {
      setError("User not logged in");
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Check the response data in the console
        console.log("API Response:", response);

        if (response.data && response.data.length > 0) {
          setJobs(response.data);
        } else {
          setJobs([]); // If no jobs are returned, set jobs to an empty array
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      }
    };

    fetchJobs();
  }, [userId]);

  return (
    <div className="container">
      <h2 className="heading">Jobs & Applications</h2>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Show error message if any */}
      {jobs.length > 0 ? (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-info">
                {job.company} - {job.location}
              </p>
              <p className="job-description">{job.description}</p>

              <h4 className="applicants-heading">Applicants:</h4>
              {job.applications && job.applications.length > 0 ? (
                <ul className="applicants-list">
                  {job.applications.map((app) => (
                    <li key={app._id} className="applicant-card">
                      <p>
                        <strong>Name:</strong> {app.user?.name || "Unknown"}
                      </p>
                      <p>
                        <strong>Email:</strong> {app.user?.email || "N/A"}
                      </p>
                      <p>
                        <strong>Resume:</strong>{" "}
                        <a
                          href={app.resume}
                          className="resume-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-badge ${
                            app.status === "accepted"
                              ? "status-accepted"
                              : app.status === "rejected"
                              ? "status-rejected"
                              : "status-pending"
                          }`}
                        >
                          {app.status}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-applications">No applications yet.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No jobs found.</p>
      )}
    </div>
  );
}

export default JobsWithApplications;
