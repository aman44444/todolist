import { useEffect, useRef } from "react";
import "../../styles/AlarmTimePicker/AlarmTimePicker.css";

const ITEM_HEIGHT = 36;
const SPACER_COUNT = 2;

const generateNumbers = (max) => Array.from({ length: max }, (_, i) => i);

const addSpacers = (arr) => {
  return [
    ...Array(SPACER_COUNT).fill(null),
    ...arr,
    ...Array(SPACER_COUNT).fill(null),
  ];
};

const AlarmPicker = ({ alarmTime, setAlarmTime }) => {
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);

  const handleScroll = () => {
    const hourIndex = Math.round(hoursRef.current.scrollTop / ITEM_HEIGHT);
    const minuteIndex = Math.round(minutesRef.current.scrollTop / ITEM_HEIGHT);

    const hour = Math.max(0, Math.min(23, hourIndex - SPACER_COUNT));
    const minute = Math.max(0, Math.min(59, minuteIndex - SPACER_COUNT));
    const newTime =
      String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");

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
      hoursRef.current.scrollTop = (h + SPACER_COUNT) * ITEM_HEIGHT;
    }

    if (minutesRef.current) {
      minutesRef.current.scrollTop = (m + SPACER_COUNT) * ITEM_HEIGHT;
    }
  }, [alarmTime, setAlarmTime]);

  useEffect(() => {
    if (!alarmTime) return;

    const [h, m] = alarmTime.split(":").map(Number);

    if (hoursRef.current) {
      hoursRef.current.scrollTop = (h + SPACER_COUNT) * ITEM_HEIGHT;
    }

    if (minutesRef.current) {
      minutesRef.current.scrollTop = (m + SPACER_COUNT) * ITEM_HEIGHT;
    }
  }, [alarmTime]);

  return (
    <div className="picker-container">
      <div className="picker-column" ref={hoursRef} onScroll={handleScroll}>
        {addSpacers(generateNumbers(24)).map((h, idx) => (
          <div
            key={idx}
            className={`picker-item ${h === null ? "spacer" : ""}`}
          >
            {h !== null ? String(h).padStart(2, "0") : ""}
          </div>
        ))}
      </div>

      <div className="picker-separator">:</div>

      <div className="picker-column" ref={minutesRef} onScroll={handleScroll}>
        {addSpacers(generateNumbers(60)).map((m, idx) => (
          <div
            key={idx}
            className={`picker-item ${m === null ? "spacer" : ""}`}
          >
            {m !== null ? String(m).padStart(2, "0") : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlarmPicker;
