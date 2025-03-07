import React, { useState } from "react";
import "./styling.css";
import axios from "axios";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    setJobs(null); 
    try {
      const query = new URLSearchParams();

      if (searchQuery) query.append("title", searchQuery);
      if (location) query.append("location", location);

      if (!searchQuery && !location) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5005/api/jobs?${query.toString()}`
      );
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>One search, millions of jobs</h2>
      <div className="job-search-form">
        <div className="input-container">
          <input
            type="text"
            className="input-group"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
          <label className={searchQuery ? "active" : ""}>
            Job title, skills or company
          </label>
        </div>

        <div className="input-container">
          <input
            type="text"
            className="input-group"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <label className={location ? "active" : ""}>
            City, Region, Zip Code
          </label>
        </div>

        <button className="search-btn" onClick={fetchJobs} disabled={loading}>
          {loading ? "Searching..." : "Search for jobs"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs !== null && jobs.length > 0 ? (
        <div className="job-results">
          <h3>Job Results</h3>
          <div className="job-cards-container">
            {jobs.map((job) => (
              <div className="job-card" key={job._id}>
                <h4>{job.title}</h4>
                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <button className="apply-btn">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      ) : jobs !== null ? (
        <p>No jobs found</p>
      ) : null}
    </div>
  );
}

export default Home;
