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
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    minSalary: 0,
    maxSalary: 150000,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs`
        );
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again.");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (jobId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(jobId)
        ? prevFavorites.filter((id) => id !== jobId)
        : [...prevFavorites, jobId]
    );
  };

  const getUniqueValues = (key) => {
    return [...new Set(jobs.map((job) => job[key]))].filter(Boolean);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: name.includes("Salary") ? Number(value) : value,
    }));
  };

  useEffect(() => {
    let filtered = jobs.filter((job) => {
      const jobSalary = job.salary || 0;
      return (
        (filters.title ? job.title === filters.title : true) &&
        (filters.company ? job.company === filters.company : true) &&
        (filters.location ? job.location === filters.location : true) &&
        jobSalary >= filters.minSalary &&
        jobSalary <= filters.maxSalary
      );
    });

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  return (
    <div className="jobs-container">
      <div className="filter-section">
        <h3>Filter Jobs</h3>
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

        <label>Salary Range:</label>
        <div className="salary-range">
          <input
            type="number"
            name="minSalary"
            value={filters.minSalary}
            onChange={handleFilterChange}
          />
          <span>to</span>
          <input
            type="number"
            name="maxSalary"
            value={filters.maxSalary}
            onChange={handleFilterChange}
          />
        </div>
      </div>

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
                <button
                  className={`favorite-btn ${
                    favorites.includes(job._id) ? "favorited" : ""
                  }`}
                  onClick={() => toggleFavorite(job._id)}
                >
                  {favorites.includes(job._id)
                    ? "★ Favorited"
                    : "☆ Add to Favorites"}
                </button>
              </div>
            ))
          ) : (
            <p>No jobs match your filters</p>
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
