import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./components/Authentication";

function App() {
  return (
    <>
      <Navbar />
      <Authentication />
    </>
  );
}

export default App;
