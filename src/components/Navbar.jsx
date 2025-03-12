import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/job-hub.png";
import "./styling.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "./UserContext"; // Import User Context

function Navbar() {
  const { user, setUser } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage if context is empty
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null); 
    navigate("/");
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
                    <button>My Job Postings</button>
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
