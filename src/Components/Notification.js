import React from 'react';
import '../Styles/Notification.css';

const Notification = ({ task, onClose }) => {
  return (
    <div className="notification">
      <div className="notification-content">
      <p>{`Alarm for task: ${task}`}</p>
      <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default Notification;


