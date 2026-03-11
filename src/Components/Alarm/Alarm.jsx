import { useState, useRef, useEffect } from "react";
import "../../Styles/Alarm/Alarm.css";
import { PiAlarmLight } from "react-icons/pi";

const Alarm = ({ alarmTime, setAlarmTime }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
  if (!alarmTime) return;

  const interval = setInterval(() => {
    const now = new Date();
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    if (currentTime === alarmTime) {
      audioRef.current?.play();
    }
  }, 1000);

  return () => clearInterval(interval);
}, [alarmTime]);

  return (
    <div className="alarm-wrapper" ref={containerRef}>
      <audio ref={audioRef} src="../audio/alarm2.mp3" preload="auto" />
      <button
        className="alarm-icon"
        type="button"
        aria-label="Set alarm"
        onClick={() => setOpen((prev) => !prev)}
      >
       <PiAlarmLight size={30} />
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