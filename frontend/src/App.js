// /src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import ProfileDropdown from "./components/ProfileDropdown";
import HomePage from "./components/HomePage";
import Courses from "./components/Courses";
import Enrollments from "./components/Enrollments";
import CalendarPage from "./components/Calendar";
import Certificates from "./components/Certificates";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import Videos from "./components/Videos";
import Messages from "./components/Messages";
import AddCertificate from "./components/AddCertificate";
import DeleteCertificateForm from "./components/DeleteCertificateForm";
import Login from "./components/Login";
import "./App.css";
import ManageVideos from "./components/ManageVideos";  // Import the new component

const PrivateRoute = ({ children }) => {
  // Replace with your actual authentication logic from AuthContext if needed
  const isAuthenticated = true;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const MainApp = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-container">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Everything to the right of the sidebar, including header & page content */}
      <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>

        <header className="header">
          <h1>Online Learning Platform</h1>
          <ProfileDropdown />
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/enrollments" element={<Enrollments />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/add-certificate" element={<AddCertificate />} />
            <Route path="/videos/course/:courseId" element={<Videos />} />
            <Route path="/delete-certificate" element={<DeleteCertificateForm />} />
            <Route path="/videos/manage" element={<ManageVideos />} />
            <Route path="/videos" element={<Videos />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <MainApp />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
