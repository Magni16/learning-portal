// /src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
//import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome, {{name}}",
      "availableCourses": "Available Courses",
      "enrolledCourses": "Your Enrolled Courses",
      "settings": "Settings",
      "changePassword": "Change Password",
      "preferredLanguage": "Preferred Language",
      "javaProgramming": "Java Programming",
      "springBootMastery": "Spring Boot Mastery",
      "buildRESTAPIs": "Build REST APIs using Spring Boot",
      "reactForBeginners": "React for Beginners",
      "introductionToReact": "Introduction to React.js",
      "enrollButton": "Enroll",
      "enrolledSuccessfully": "Enrolled successfully!",
      "enrollmentFailed": "Enrollment failed",
      "enrollmentError": "Enrollment error: ",
      "userNotAuthenticated": "User not authenticated",
      "progressUpdated": "Progress updated!",
      "loadingUser": "Loading user...",
      "loadingEnrollments": "Loading enrollments...",
      "unexpectedData": "Unexpected data format received from API.",
      "noEnrollmentsFound": "No enrollments found.",
      "progress": "Progress: ",
      "increaseProgress": "Increase Progress",
      "httpError": "HTTP error! status: ",
      "certificates": "Certificates",
      "certificatesInfo": "Your certificates will be displayed here.",
      "courseCompleted": "Course is already completed",
            "updateProgressFailed": "Failed to update progress.",
            "updateProgressError": "Error updating progress: ",
            "decreaseProgress": "Decrease Progress",
                  "progressZero": "Progress is already at 0%",
                  "certificates": "Certificates",
                        "noCertificates": "No certificates available."

      // Add more keys as needed
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido, {{name}}",
      "availableCourses": "Cursos Disponibles",
      "enrolledCourses": "Tus Cursos Inscritos",
      "settings": "Ajustes",
      "changePassword": "Cambiar la Contraseña",
      "preferredLanguage": "Idioma Preferido",
      "javaProgramming": "Programación en Java",
      "springBootMastery": "Dominio de Spring Boot",
      "buildRESTAPIs": "Construir API REST usando Spring Boot",
      "reactForBeginners": "React para Principiantes",
      "introductionToReact": "Introducción a React.js",
      "enrollButton": "Inscribirse",
      "enrolledSuccessfully": "¡Inscripción exitosa!",
      "enrollmentFailed": "Fallo en la inscripción",
      "enrollmentError": "Error en la inscripción: ",
      "userNotAuthenticated": "Usuario no autenticado",
      "progressUpdated": "¡Progreso actualizado!",
      "loadingUser": "Cargando usuario...",
      "loadingEnrollments": "Cargando inscripciones...",
      "unexpectedData": "Formato de datos inesperado recibido del API.",
      "noEnrollmentsFound": "No se encontraron inscripciones.",
      "progress": "Progreso: ",
      "increaseProgress": "Incrementar Progreso",
      "httpError": "Error HTTP! estado: ",
      "certificates": "Certificados",
      "certificatesInfo": "Tus certificados se mostrarán aquí.",
      "courseCompleted": "El curso ya está completado",
            "updateProgressFailed": "Fallo al actualizar el progreso.",
            "updateProgressError": "Error al actualizar el progreso: ",
            "decreaseProgress": "Disminuir el progreso",
                  "progressZero": "El progreso ya está en 0%",
                  "certificates": "Certificados",
                        "noCertificates": "No hay certificados disponibles."
      // Add more keys as needed
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue, {{name}}",
      "availableCourses": "Cours disponibles",
      "enrolledCourses": "Vos cours inscrits",
      "settings": "Paramètres",
      "changePassword": "Changer le mot de passe",
      "preferredLanguage": "Langue préférée",
      "javaProgramming": "Java Programming",
      "springBootMastery": "Spring Boot Mastery",
      "buildRESTAPIs": "Construire des API REST avec Spring Boot",
      "reactForBeginners": "React pour débutants",
      "introductionToReact": "Introduction à React.js",
      "enrollButton": "S'inscrire",
      "enrolledSuccessfully": "Inscription réussie !",
      "enrollmentFailed": "Échec de l'inscription",
      "enrollmentError": "Erreur d'inscription : ",
      "userNotAuthenticated": "Utilisateur non authentifié",
      "progressUpdated": "Progrès mis à jour !",
      "loadingUser": "Chargement de l'utilisateur...",
      "loadingEnrollments": "Chargement des inscriptions...",
      "unexpectedData": "Format de données inattendu reçu du API.",
      "noEnrollmentsFound": "Aucune inscription trouvée.",
      "progress": "Progrès : ",
      "increaseProgress": "Augmenter le progrès",
      "httpError": "Erreur HTTP ! état: ",
      "certificates": "Certificats",
      "certificatesInfo": "Vos certificats seront affichés ici.",
      "courseCompleted": "Le cours est déjà terminé",
            "updateProgressFailed": "Échec de la mise à jour de la progression.",
            "updateProgressError": "Erreur de mise à jour de la progression : ",
            "decreaseProgress": "Diminuer le progrès",
                  "progressZero": "Le progrès est déjà à 0%",
                  "certificates": "Certificats",
                        "noCertificates": "Aucun certificat disponible."
      // Add more keys as needed
    }
  },
  de: {
    translation: {
      "welcome": "Willkommen, {{name}}",
      "availableCourses": "Verfügbare Kurse",
      "enrolledCourses": "Ihre eingeschriebenen Kurse",
      "settings": "Einstellungen",
      "changePassword": "Passwort ändern",
      "preferredLanguage": "Bevorzugte Sprache",
      "javaProgramming": "Java Programming",
      "springBootMastery": "Spring Boot Mastery",
      "buildRESTAPIs": "REST-APIs mit Spring Boot erstellen",
      "reactForBeginners": "React für Anfänger",
      "introductionToReact": "Einführung in React.js",
      "enrollButton": "Einschreiben",
      "enrolledSuccessfully": "Erfolgreich eingeschrieben!",
      "enrollmentFailed": "Anmeldung fehlgeschlagen",
      "enrollmentError": "Anmeldefehler: ",
      "userNotAuthenticated": "Benutzer nicht authentifiziert",
      "progressUpdated": "Fortschritt aktualisiert!",
      "loadingUser": "Benutzer wird geladen...",
      "loadingEnrollments": "Einschreibungen werden geladen...",
      "unexpectedData": "Unerwartetes Datenformat vom API empfangen.",
      "noEnrollmentsFound": "Keine Einschreibungen gefunden.",
      "progress": "Fortschritt: ",
      "increaseProgress": "Fortschritt erhöhen",
      "httpError": "HTTP-Fehler! Status: ",
      "certificates": "Zertifikate",
      "certificatesInfo": "Ihre Zertifikate werden hier angezeigt.",
      "courseCompleted": "Der Kurs ist bereits abgeschlossen",
            "updateProgressFailed": "Fortschritt konnte nicht aktualisiert werden.",
            "updateProgressError": "Fehler beim Aktualisieren des Fortschritts: ",
            "decreaseProgress": "Fortschritt verringern",
                  "progressZero": "Der Fortschritt ist bereits bei 0%",
                   "certificates": "Zertifikate",
                        "noCertificates": "Keine Zertifikate verfügbar."
      // Add more keys as needed
    }
  },
  zh: {
    translation: {
      "welcome": "欢迎, {{name}}",
      "availableCourses": "可用课程",
      "enrolledCourses": "您注册的课程",
      "settings": "设置",
      "changePassword": "更改密码",
      "preferredLanguage": "首选语言",
      "javaProgramming": "Java 编程",
      "springBootMastery": "Spring Boot 精通",
      "buildRESTAPIs": "使用 Spring Boot 构建 REST API",
      "reactForBeginners": "React 初学者",
      "introductionToReact": "React.js 简介",
      "enrollButton": "注册",
      "enrolledSuccessfully": "注册成功！",
      "enrollmentFailed": "注册失败",
      "enrollmentError": "注册错误：",
      "userNotAuthenticated": "用户未认证",
      "progressUpdated": "进度已更新！",
      "loadingUser": "加载用户中...",
      "loadingEnrollments": "加载注册信息中...",
      "unexpectedData": "从 API 接收到意外的数据格式。",
      "noEnrollmentsFound": "未找到注册课程。",
      "progress": "进度：",
      "increaseProgress": "增加进度",
      "httpError": "HTTP 错误！状态：",
      "certificates": "证书",
      "certificatesInfo": "您的证书将显示在这里。",
      "courseCompleted": "课程已完成",
            "updateProgressFailed": "无法更新进度。",
            "updateProgressError": "更新进度时出错：",
            "decreaseProgress": "减少进度",
                  "progressZero": "进度已达到0%",
                  "certificates": "证书",
                        "noCertificates": "没有可用的证书。",
      // Add more keys as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
