import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/job-hub.png";
import "./styling.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase, faCaretDown } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [profileImage, setProfileImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("profileImage");
    localStorage.removeItem("token"); 
    setProfileImage(null);
    navigate("/login"); 
  };

  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        <Link to="./">
          <img src={logo} alt="Job Hub Logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <div className="link-post-job">
          <FontAwesomeIcon icon={faSuitcase} />
          <Link to="./post-job">
            <p>Post Jobs</p>
          </Link>
        </div>

        <div className="profile-section">
          {profileImage ? (
            <div className="profile-dropdown">
              <img
                src={profileImage}
                className="profile-image"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                alt="Profile"
              />
              <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
              {dropdownOpen && (
                <div className="dropdown-menu">
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
