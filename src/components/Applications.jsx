import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Applications() {
  const { jobId } = useParams(); 
  const userId = "USER_ID_FROM_AUTH"; 

  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      setMessage("Missing Job ID or User ID.");
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
        `http://localhost:5000/api/applications/${jobId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Application submitted successfully!");
      setFormData({ coverLetter: "", resume: null });
    } catch (error) {
      setMessage("Failed to submit application. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-form">
      <h2>Apply for Job ID: {jobId}</h2>
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
