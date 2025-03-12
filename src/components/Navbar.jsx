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

function Navbar() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    setProfileImage(storedImage);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token); // Using jwt_decode correctly
        setUserName(decoded.name);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("profileImage");
    localStorage.removeItem("token");
    setProfileImage(null);
    setUserName(null);
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
          {profileImage || userName ? (
            <div className="profile-dropdown">
              <div
                className="profile-display"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    className="profile-image"
                    alt="Profile"
                  />
                ) : (
                  <div className="profile-name">{userName}</div>
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
