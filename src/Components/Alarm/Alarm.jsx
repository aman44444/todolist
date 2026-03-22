import { useState, useRef, useEffect,useCallback} from "react";
import "../../Styles/Alarm/Alarm.css";
import { PiAlarmLight } from "react-icons/pi";


const Alarm = ({ alarmTime, setAlarmTime }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = useCallback(() => setIsOpen(false), []);


  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [close]);

  const handleTimeChange = (e) => {
    setAlarmTime(e.target.value);
  };

  return (
    <div className="alarm-wrapper" ref={containerRef}>
      <button
        className="alarm-icon"
        type="button"
        aria-label="Set alarm"
        onClick={toggle}
      >
        <PiAlarmLight size={30} />
      </button>

      {isOpen && (
        <div className="alarm-popup">
          <label  htmlFor="alarm-time">Set Alarm</label>

          <input
            id="alarm-time"
            type="time"
            value={alarmTime || ""}
            onChange={handleTimeChange}
          />

          <button className="alarm-save" onClick={() => setIsOpen(false)}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Alarm;
