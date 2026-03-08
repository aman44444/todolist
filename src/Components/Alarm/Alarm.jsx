import { useState, useRef, useEffect } from "react";
import "../../Styles/Alarm/Alarm.css";

const Alarm = ({ alarmTime, setAlarmTime }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);


  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="alarm-wrapper" ref={containerRef}>
      {/* Alarm Icon */}
      <button
        className="alarm-icon"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        ⏰
      </button>

      {open && (
        <div className="alarm-popup">
          <label>Set Alarm</label>

          <input
            type="time"
            value={alarmTime || ""}
            onChange={(e) => setAlarmTime(e.target.value)}
          />

          <button
            className="alarm-save"
            onClick={() => setOpen(false)}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Alarm;