import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/job-hub.png";
import "./styling.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons"; 

function Navbar() {
  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        <img src={logo} />
      </div>
      <div className="navbar-links">
        <div className="link-post-job">
          <FontAwesomeIcon icon={faSuitcase} />
          <Link to="./">
            <p>Post Jobs </p>
          </Link>
        </div>
        <div>
          <Link to="./">
            <p>Login/Create an account </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
