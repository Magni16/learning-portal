import React, { useState } from "react";
import "../styles/Messages.css"; // Optional styling

const Messages = () => {
    // Dummy messages
    const [messages] = useState([
        { id: 1, sender: "Admin", text: "Welcome to the platform!" },
        { id: 2, sender: "John Doe", text: "Hey, I loved the Java course!" },
        { id: 3, sender: "Jane Smith", text: "Can you help me with my project?" },
    ]);

    return (
        <div className="messages-container">
            <h2>Messages</h2>
            <ul>
                {messages.map((msg) => (
                    <li key={msg.id} className="message-item">
                        <strong>{msg.sender}:</strong> {msg.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Messages;
