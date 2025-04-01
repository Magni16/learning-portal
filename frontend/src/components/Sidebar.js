// Sidebar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import {
  MdHome,
  MdLibraryBooks,
  MdAssignment,
  MdCalendarToday,
  MdVerified,
  MdVideoLibrary,
  MdSettings
} from "react-icons/md";
import { AuthContext } from "../contexts/AuthContext";

const Sidebar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <button onClick={toggleSidebar} className="toggle-btn">
        ☰
      </button>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <MdHome size={24} />
              {isSidebarOpen && <span className="link-text">Home Page</span>}
            </Link>
          </li>
          <li>
            <Link to="/courses">
              <MdLibraryBooks size={24} />
              {isSidebarOpen && <span className="link-text">Courses</span>}
            </Link>
          </li>
          <li>
            <Link to="/enrollments">
              <MdAssignment size={24} />
              {isSidebarOpen && <span className="link-text">Enrolled Courses</span>}
            </Link>
          </li>
          <li>
            <Link to="/calendar">
              <MdCalendarToday size={24} />
              {isSidebarOpen && <span className="link-text">Calendar</span>}
            </Link>
          </li>
          <li>
            <Link to="/certificates">
              <MdVerified size={24} />
              {isSidebarOpen && <span className="link-text">Certificates</span>}
            </Link>
          </li>
          {/* Normal Videos tab */}
          <li>
            <Link to="/videos/course/1">
              <MdVideoLibrary size={24} />
              {isSidebarOpen && <span className="link-text">Videos</span>}
            </Link>
          </li>
          {/* Conditionally render Manage Videos button */}
          {user && (user.role === "SUPERUSER" || user.role === "INSTRUCTOR") && (
            <li>
              <Link to="/videos/manage">
                <MdVideoLibrary size={24} />
                {isSidebarOpen && <span className="link-text">Manage Videos</span>}
              </Link>
            </li>
          )}
          <li>
            <Link to="/settings">
              <MdSettings size={24} />
              {isSidebarOpen && <span className="link-text">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
