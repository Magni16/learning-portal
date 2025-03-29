import React, { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import "../styles/Settings.css";

const Settings = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  // State for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for language preference
  const [language, setLanguage] = useState(user?.preferredLanguage || "en");

  // State for showing popup messages (object with text and type)
  const [popupMessage, setPopupMessage] = useState(null);

  // Helper function to show a popup message that fades after 5 seconds
  const showPopup = (message, type = "success") => {
    setPopupMessage({ text: message, type });
    setTimeout(() => {
      setPopupMessage(null);
    }, 5000);
  };

  // Handler for changing password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showPopup("New password and confirmation do not match.", "error");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8081/api/users/${user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });
      if (response.ok) {
        showPopup("Password updated successfully.", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showPopup("Failed to update password.", "error");
      }
    } catch (error) {
      showPopup("Error: " + error.message, "error");
    }
  };

  // Handler for changing language preference
  const handleLanguageChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/api/users/${user.id}/language`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
        credentials: "include",
      });
      if (response.ok) {
        showPopup("Language updated successfully.", "success");
        i18n.changeLanguage(language);
        console.log("Language changed to:", i18n.language);
      } else {
        const errText = await response.text();
        showPopup("Failed to update language: " + errText, "error");
      }
    } catch (error) {
      showPopup("Error: " + error.message, "error");
    }
  };

  return (
    <div className="centered-container settings-container">
      <h2>{t("settings", "Settings")}</h2>

      {popupMessage && (
        <div className={`popup-message ${popupMessage.type}`}>
          {popupMessage.text}
        </div>
      )}

      <div className="dark-mode-toggle">
        <label htmlFor="themeSwitch">{t("darkMode", "Dark Mode:")}</label>
        <input
          id="themeSwitch"
          type="checkbox"
          onChange={toggleTheme}
          checked={isDarkMode}
        />
      </div>

      <div className="settings-section">
        <h3>{t("changePassword", "Change Password")}</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>{t("currentPassword", "Current Password:")}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("newPassword", "New Password:")}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("confirmPassword", "Confirm New Password:")}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{t("updatePassword", "Update Password")}</button>
        </form>
      </div>

      <div className="settings-section">
        <h3>{t("preferredLanguage", "Preferred Language")}</h3>
        <form onSubmit={handleLanguageChange}>
          <div className="form-group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          <button type="submit">{t("updateLanguage", "Update Language")}</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
