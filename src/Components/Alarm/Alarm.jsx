import { useState, useRef, useEffect,useCallback} from "react";
import "../../styles/Alarm/Alarm.css";
import { PiAlarmLight } from "react-icons/pi";
import AlarmPicker from "../AlarmTimePicker/AlarmTimePicker";


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
          <AlarmPicker
            alarmTime={alarmTime}
            setAlarmTime={setAlarmTime}
            />
        </div>
      )}
    </div>
  );
};

export default Alarm;
