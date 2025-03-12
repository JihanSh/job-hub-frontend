import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./styling.css";

function Applications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobDetails = location.state?.job;
  console.log("Job Details:", jobDetails);

  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get userId directly from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/user-auth");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUserId(userData._id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setMessage("Authentication error. Please log in again.");
      localStorage.removeItem("user");
      navigate("/user-auth");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!jobId || !userId) {
      setMessage("Missing Job ID or User ID. Please log in.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("job", jobId);
    formDataToSend.append("user", userId);
    formDataToSend.append("coverLetter", formData.coverLetter);
    formDataToSend.append("resume", formData.resume);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}/apply`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Application submitted successfully!");
      setFormData({ coverLetter: "", resume: null });
    } catch (error) {
      setMessage("Failed to submit application. Try again.");
      console.error("Application Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-form">
      {jobDetails ? (
        <>
          <h2>Apply for {jobDetails.title}</h2>
          <h4>{jobDetails.title}</h4>
          <p>
            <strong>Company:</strong> {jobDetails.company}
          </p>
          <p>
            <strong>Location:</strong> {jobDetails.location}
          </p>
          <p>
            <strong>Salary:</strong>{" "}
            {jobDetails.salary ? `$${jobDetails.salary}` : "Not specified"}
          </p>
          <p>
            <strong>Description:</strong> {jobDetails.description}
          </p>
          <p>
            <strong>Requirements:</strong>
          </p>
        </>
      ) : (
        <p>Loading job details...</p>
      )}

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Cover Letter:</label>
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          required
        ></textarea>

        <label>Upload Resume:</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Apply Now"}
        </button>
      </form>
    </div>
  );
}

export default Applications;
