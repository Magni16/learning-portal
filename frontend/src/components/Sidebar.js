import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
// Import icons from react-icons (using Material Design icons)
import {
  MdHome,
  MdLibraryBooks,
  MdAssignment,
  MdCalendarToday,
  MdVerified,
  MdVideoLibrary,
  MdSettings
} from "react-icons/md";

const Sidebar = ({ toggleSidebar, isSidebarOpen }) => {
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
          <li>
            <Link to="/videos/course/1">
              <MdVideoLibrary size={24} />
              {isSidebarOpen && <span className="link-text">Videos</span>}
            </Link>
          </li>
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
