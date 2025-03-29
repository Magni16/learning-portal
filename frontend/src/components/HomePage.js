// /src/components/HomePage.js
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/HomePage.css"; // Import the updated CSS

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h2>{t("welcome", { name: user ? user.name : "User" })}</h2>
        <p>
          {t(
            "homepageMessage",
            "Welcome to your personalized dashboard! Explore courses, track your progress, and manage your learning."
          )}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
