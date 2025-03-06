import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const Authentication = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isSignup, setIsSignup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("name", data.name);
      if (data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      const url = isSignup ? "/auth/signup" : "/auth/login";
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (isSignup) {
        alert("Signup successful! Now log in.");
      } else {
        localStorage.setItem("token", response.data.authToken);
        alert("Login successful!");
      }

      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border rounded-xl shadow-md max-w-md mx-auto bg-white">
      <h2 className="text-xl font-bold mb-4">
        {isSignup ? "Sign Up" : "Log In"}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="border p-2 rounded"
        />

        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: true })}
              className="border p-2 rounded"
            />

            <input
              type="file"
              accept="image/*"
              {...register("profileImage")}
              className="border p-2 rounded"
              onChange={(e) =>
                setImagePreview(URL.createObjectURL(e.target.files[0]))
              }
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full mx-auto"
              />
            )}
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p
        className="text-sm mt-4 cursor-pointer text-blue-600 hover:underline"
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup
          ? "Already have an account? Log in"
          : "Don't have an account? Sign up"}
      </p>
    </div>
  );
};

export default Authentication;
