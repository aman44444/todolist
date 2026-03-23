import { useEffect, useRef } from "react";
import "../../Styles/AlarmTimePicker/AlarmTimePicker.css";

const generateNumbers = (max) => Array.from({ length: max }, (_, i) => i);

const AlarmPicker = ({ alarmTime, setAlarmTime }) => {
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);

  const ITEM_HEIGHT = 36;

  const handleScroll = () => {
    const hourIndex = Math.round(hoursRef.current.scrollTop / ITEM_HEIGHT);
    const minuteIndex = Math.round(minutesRef.current.scrollTop / ITEM_HEIGHT);

    const newTime =
      String(hourIndex).padStart(2, "0") +
      ":" +
      String(minuteIndex).padStart(2, "0");

    if (newTime !== alarmTime) {
      setAlarmTime(newTime);
    }
  };

  useEffect(() => {
    if (alarmTime) return;

    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();

    const formatted =
      String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");

    setAlarmTime(formatted);

    if (hoursRef.current) {
      hoursRef.current.scrollTop = h * ITEM_HEIGHT;
    }

    if (minutesRef.current) {
      minutesRef.current.scrollTop = m * ITEM_HEIGHT;
    }
  }, [alarmTime, setAlarmTime]);

  useEffect(() => {
    if (!alarmTime) return;

    const [h, m] = alarmTime.split(":").map(Number);

    if (hoursRef.current) {
      hoursRef.current.scrollTop = h * ITEM_HEIGHT;
    }

    if (minutesRef.current) {
      minutesRef.current.scrollTop = m * ITEM_HEIGHT;
    }
  }, [alarmTime]);

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
