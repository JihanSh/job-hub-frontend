import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./components/Authentication";
import JobPostingForm from "./components/JobPostingForm";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/user-auth" element={<Authentication />} />
        <Route path="/post-job" element={<JobPostingForm />} />
      </Routes>
    </>
  );
}

export default App;
