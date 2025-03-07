import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styling.css";

function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/jobs");
        setJobs(response.data);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again.");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="jobs-wrapper">
      <div className="jobs-list">
        <h3>All Jobs</h3>
        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className={`job-section ${
                selectedJob?._id === job._id ? "active" : ""
              }`}
              onClick={() => setSelectedJob(job)}
            >
              <h4>{job.title}</h4>
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
            </div>
          ))
        ) : (
          <p>No jobs available</p>
        )}
      </div>

      <div className="job-details">
        {selectedJob ? (
          <>
            <h3>Job Details</h3>
            <h4>{selectedJob.title}</h4>
            <p>
              <strong>Company:</strong> {selectedJob.company}
            </p>
            <p>
              <strong>Location:</strong> {selectedJob.location}
            </p>
            <p>
              <strong>Salary:</strong>{" "}
              {selectedJob.salary ? `$${selectedJob.salary}` : "Not specified"}
            </p>
            <p>
              <strong>Description:</strong> {selectedJob.description}
            </p>
            <p>
              <strong>Requirements:</strong>
            </p>
            <ul>
              {selectedJob.requirements &&
              selectedJob.requirements.length > 0 ? (
                selectedJob.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))
              ) : (
                <li>No specific requirements</li>
              )}
            </ul>
            <button className="apply-btn">Apply Now</button>
          </>
        ) : (
          <p>Select a job to see details</p>
        )}
      </div>
    </div>
  );
}

export default AllJobs;
