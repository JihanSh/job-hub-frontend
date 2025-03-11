import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./components/Authentication";
import JobPostingForm from "./components/JobPostingForm";
import Home from "./components/Home";
import AllJobs from "./components/AllJobs";
import Applications from "./components/PostApplications";
import UserApplications from "./components/UserApplications";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-auth" element={<Authentication />} />
        <Route path="/post-job" element={<JobPostingForm />} />
        <Route path="/all-jobs" element={<AllJobs />} />
        <Route path="/applications/:jobId" element={<Applications />} />
        <Route path="/my-applications" element={<UserApplications />} />
      </Routes>
    </>
  );
}

export default App;
