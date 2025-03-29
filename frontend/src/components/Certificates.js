// /src/components/Certificates.js
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/Certificates.css";
import DeleteCertificateForm from "./DeleteCertificateForm";
import AddCertificate from "./AddCertificate";

const Certificates = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`http://localhost:8081/api/certificates/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Certificates:", data);
        setCertificates(data);
      })
      .catch((err) => console.error("Error fetching certificates:", err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="centered-container">
          <h2>{t("certificates", "Certificates")}</h2>
          <p>{t("certificatesInfo", "Your certificates will be displayed here.")}</p>

          {user && user.email.toLowerCase() === "bob@example.com" && (
            <div className="buttons-container">
              <button onClick={() => setShowAddPopup(true)} className="add-btn">
                {t("addCertificate", "Add Certificate")}
              </button>
              <button onClick={() => setShowDeletePopup(true)} className="delete-btn">
                {t("deleteCertificate", "Delete Certificate")}
              </button>
            </div>
          )}

      {loading && <p>{t("loadingCertificates", "Loading certificates...")}</p>}

      <div className="certificates-grid">
        {certificates.length === 0 ? (
          <p>{t("noCertificates", "No certificates available.")}</p>
        ) : (
          certificates.map((cert) => (
            <div key={cert.certificateId} className="certificate-container">
              <h3>{cert.name}</h3>
              <iframe
                src={cert.certificateUrl.replace("/view?usp=drive_link", "/preview")}
                className="certificate-frame"
                allow="autoplay"
                title={cert.name}
              ></iframe>
            </div>
          ))
        )}
      </div>

      {showDeletePopup && (
        <DeleteCertificateForm
          setShowDeletePopup={setShowDeletePopup}
          setCertificates={setCertificates}
          certificates={certificates}
        />
      )}

      {showAddPopup && (
        <AddCertificate
          setShowAddPopup={setShowAddPopup}
          onAdd={(newCert) => setCertificates([...certificates, newCert])}
        />
      )}
    </div>
  );
};

export default Certificates;
