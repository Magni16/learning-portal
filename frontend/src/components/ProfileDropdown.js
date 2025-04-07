import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileDropDown.css";
import { flushSync } from 'react-dom';
const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

 const handleLogout = () => {
   flushSync(() => {
     logout();
   });
   navigate("/login");
 };

  const handleProfile = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  const handleMessages = () => {
    navigate("/messages");
    setIsOpen(false);
  };

  const handlePreferences = () => {
    navigate("/settings"); // ✅ Navigate to Settings when clicking "Preferences"
    setIsOpen(false);
  };

  return (
    <div className="profile-container">
      <button className="profile-btn" onClick={() => setIsOpen(!isOpen)}>
        👤
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li onClick={handleProfile}>Profile</li>
            <li onClick={handleMessages}>Messages</li>
            <li onClick={handlePreferences}>Preferences</li> {/* ✅ Fixed Navigation */}
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
