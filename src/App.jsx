import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./components/Authentication";
import JobPostingForm from "./components/JobPostingForm";
import Home from "./components/Home";
import AllJobs from "./components/AllJobs";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-auth" element={<Authentication />} />
        <Route path="/post-job" element={<JobPostingForm />} />
        <Route path="/all-jobs" element={<AllJobs />} />
      </Routes>
    </>
  );
}

export default App;
