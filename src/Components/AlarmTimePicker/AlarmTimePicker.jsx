import { useEffect, useRef } from "react";
import "../../Styles/AlarmTimePicker/AlarmTimePicker.css";

const generateNumbers = (max) =>
  Array.from({ length: max }, (_, i) => i);

const AlarmPicker = ({ alarmTime, setAlarmTime }) => {
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);

  const ITEM_HEIGHT = 36;

  const handleScroll = () => {
    const hourIndex = Math.round(hoursRef.current.scrollTop / ITEM_HEIGHT);
    const minuteIndex = Math.round(minutesRef.current.scrollTop / ITEM_HEIGHT);

    const hours = String(hourIndex).padStart(2, "0");
    const minutes = String(minuteIndex).padStart(2, "0");

    setAlarmTime(`${hours}:${minutes}`);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <div className="picker-container">
      <div className="picker-column" ref={hoursRef} onScroll={handleScroll}>
        {generateNumbers(24).map((h) => (
          <div key={h} className="picker-item">
            {String(h).padStart(2, "0")}
          </div>
        ))}
      </div>

      <div className="picker-separator">:</div>

      <div className="picker-column" ref={minutesRef} onScroll={handleScroll}>
        {generateNumbers(60).map((m) => (
          <div key={m} className="picker-item">
            {String(m).padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlarmPicker;