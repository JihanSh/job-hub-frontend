import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styling.css";

function JobsWithApplications() {
  const [jobs, setJobs] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("user"));
  const [error, setError] = useState("");

  useEffect(() => {
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

        setJobs(response.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      }
    };

    fetchJobs();
  }, [userId]);

  // Function to update application status
  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/applications/${appId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setJobs((prevJobs) =>
          prevJobs.map((job) => ({
            ...job,
            applications: job.applications.map((app) =>
              app._id === appId ? { ...app, status: newStatus } : app
            ),
          }))
        );
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      setError("Failed to update application status.");
    }
  };

  // Function to delete a job
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      setError("Failed to delete job.");
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Manage Applications</h2>
      {error && <p className="error-message">{error}</p>}
      {jobs.length > 0 ? (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">
                <strong>Company:</strong> {job.company}
              </p>
              <p className="job-location">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="job-description">
                <strong>Description:</strong> {job.description}
              </p>

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
                      {/* Display Resume if Available */}
                      {app.resume && (
                        <p>
                          <strong>Resume:</strong>{" "}
                          <a
                            href={app.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-link"
                          >
                            View Resume
                          </a>{" "}
                          |{" "}
                          <a
                            href={app.resume}
                            download
                            className="resume-download"
                          >
                            Download
                          </a>
                        </p>
                      )}
                      <p>
                        <strong>Status:</strong>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateApplicationStatus(app._id, e.target.value)
                          }
                          className="status-dropdown"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-applications">No applications yet.</p>
              )}

              {/* Delete Job Button */}
              <button
                className="delete-job-btn"
                onClick={() => deleteJob(job._id)}
              >
                Delete Job
              </button>
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
