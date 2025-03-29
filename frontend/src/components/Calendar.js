import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  // Example events; adjust times so they are visible in day/week views
  const events = [
    {
      title: "Meeting with Bob",
      start: new Date(2025, 1, 15, 10, 0),
      end: new Date(2025, 1, 15, 11, 0),
    },
    {
      title: "Lunch Break",
      start: new Date(2025, 2, 20, 12, 0),
      end: new Date(2025, 2, 20, 13, 0),
    },
    {
      title: "Project Review",
      start: new Date(2025, 3, 5, 15, 0),
      end: new Date(2025, 3, 5, 16, 0),
    },
  ];

  return (
    <div
      style={{
        height: "600px", // Adjust height as needed
        width: "80%",
        margin: "2rem auto",
        padding: "1rem",
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "8px",
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        view={currentView}
        onNavigate={(date) => setCurrentDate(date)}
        onView={(view) => setCurrentView(view)}
        toolbar={true}
        // Explicitly allow these views:
        views={["month", "week", "day", "agenda"]}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default CalendarPage;
