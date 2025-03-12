import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/job-hub.png";
import "./styling.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSuitcase,
  faCaretDown,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
// Corrected import for jwt-decode with default export
import * as jwt_decode from "jwt-decode";

import { useUser } from "./UserContext"; // Import useUser

function Navbar() {
  const { user, setUser } = useUser();
    const [profileImage, setProfileImage] = useState(null);
    const [userName, setUserName] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("profileImage");
    localStorage.removeItem("token");
    setUser(null); // Clear user data from state
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Job Hub Logo" />
        </Link>
      </div>

      <div className="navbar-links">
        <div className="link-post-job">
          <FontAwesomeIcon icon={faSuitcase} />
          <Link to="/post-job">
            <p>Post Jobs</p>
          </Link>
        </div>

        <div className="profile-section">
          {user ? (
            <div className="profile-dropdown">
              <div
                className="profile-display"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    className="profile-image"
                    alt="Profile"
                  />
                ) : (
                  <div className="profile-name">{user.name}</div>
                )}
                <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/my-jobs">
                    <button>My Jobs Postings</button>
                  </Link>
                  <Link to="/my-applications">
                    <button>My Applications</button>
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/user-auth">
              <p>Login/SignUp</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
