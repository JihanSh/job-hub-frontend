import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styling.css";
import { Link } from "react-router-dom";

function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    salary: false, // Checkbox for salary filter
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/jobs");
        setJobs(response.data);
        setFilteredJobs(response.data); // Initialize filtered jobs with all jobs
      } catch (err) {
        setError("Failed to fetch jobs. Please try again.");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Extract unique values for dropdown options
  const getUniqueValues = (key) => {
    return [...new Set(jobs.map((job) => job[key]))].filter(Boolean);
  };

  // Update filters and apply filtering logic
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    };
    setFilters(newFilters);

    // Apply Filtering Logic
    let filtered = jobs.filter((job) => {
      return (
        (newFilters.title ? job.title === newFilters.title : true) &&
        (newFilters.company ? job.company === newFilters.company : true) &&
        (newFilters.location ? job.location === newFilters.location : true) &&
        (!newFilters.salary || job.salary) // Only show jobs with salary if checked
      );
    });

    setFilteredJobs(filtered);
  };

  return (
    <div className="jobs-container">
      {/* Filtering Sidebar */}
      <div className="filter-section">
        <h3>Filter Jobs</h3>

        {/* Job Title Dropdown */}
        <label>Title:</label>
        <select
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
        >
          <option value="">All Titles</option>
          {getUniqueValues("title").map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        {/* Company Dropdown */}
        <label>Company:</label>
        <select
          name="company"
          value={filters.company}
          onChange={handleFilterChange}
        >
          <option value="">All Companies</option>
          {getUniqueValues("company").map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        {/* Location Dropdown */}
        <label>Location:</label>
        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        >
          <option value="">All Locations</option>
          {getUniqueValues("location").map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        {/* Salary Checkbox */}
        <label>
          <input
            type="checkbox"
            name="salary"
            checked={filters.salary}
            onChange={handleFilterChange}
          />
          Show only jobs with salary specified
        </label>
      </div>

      {/* Jobs Listing */}
      <div className="jobs-wrapper">
        <div className="jobs-list">
          <h3>All Jobs</h3>
          {loading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
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
            <p>No jobs match your filters</p>
          )}
        </div>

        {/* Job Details */}
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
                {selectedJob.salary
                  ? `$${selectedJob.salary}`
                  : "Not specified"}
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
              <Link
                to={`/applications/${selectedJob._id}`}
                state={{ job: selectedJob }}
              >
                <button className="apply-btn">Apply Now</button>
              </Link>
            </>
          ) : (
            <p>Select a job to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllJobs;
