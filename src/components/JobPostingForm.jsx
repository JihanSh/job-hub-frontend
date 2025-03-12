import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styling.css";

function JobPostingForm() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
  });

  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!token) {
      setError("Please log in to post a job.");
      return;
    }

    const jobData = {
      ...formData,
      requirements: formData.requirements.split(",").map((req) => req.trim()),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobs`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("responseeeee" , response)
      setSuccessMessage("Job posted successfully!");
      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        requirements: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="job-form-container">
      <h2>Post a Job</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {!token ? (
        <p style={{ textAlign: 'center' }}>Please log in to post a job.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            required
          />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            required
          />
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary (Optional)"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            required
          />
          <input
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Requirements (comma separated)"
            required
          />

          <button type="submit">Post Job</button>
        </form>
      )}
    </div>
  );
}

export default JobPostingForm;
