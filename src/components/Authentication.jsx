import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./styling.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const Authentication = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ Correctly using context

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
      const url = isSignup
        ? `${BASE_URL}/auth/signup`
        : `${BASE_URL}/auth/login`;

      let response;

      if (isSignup) {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("name", data.name);
        if (data.profileImage?.[0]) {
          formData.append("profileImage", data.profileImage[0]);
        }

        response = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Signup successful! Now log in.");
        setIsSignup(false);
      } else {
        response = await axios.post(url, {
          email: data.email,
          password: data.password,
        });
        console.log("Response:", response);
        if (response.data && response.data.authToken) {
          localStorage.setItem("token", response.data.authToken);
          localStorage.setItem("user", response.data.payload._id); 
          console.log("User ID stored:", response.data.payload._id); 
          localStorage.setItem(
            "profileImage",
            response.data.payload.profileImage
          );
          setUser({
            name: response.data.payload.name,
            profileImage: response.data.payload.profileImage,
          });

          alert("Login successful!");
          navigate("/");
          console.log(response.data.payload); // Log the entire payload for debugging
        } else {
          console.error("authToken not found in response");
        }
      }

      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="auth-input"
        />

        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: true })}
              className="auth-input"
            />

            <input
              type="file"
              accept="image/*"
              {...register("profileImage")}
              className="auth-input"
              onChange={(e) =>
                setImagePreview(URL.createObjectURL(e.target.files[0]))
              }
            />

            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
          </>
        )}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p className="auth-toggle" onClick={() => setIsSignup(!isSignup)}>
        {isSignup
          ? "Already have an account? Log in"
          : "Don't have an account? Sign up"}
      </p>
    </div>
  );
};

export default Authentication;
