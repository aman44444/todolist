import { useEffect, useRef, useCallback} from "react";
import "../../styles/AlarmTimePicker/AlarmTimePicker.css";

const ITEM_HEIGHT = 36;
const SPACER_COUNT = 2;
const COL_HEIGHT = 150;


const generateNumbers = (max) => Array.from({ length: max }, (_, i) => i);

const addSpacers = (arr) => {
  return [
    ...Array(SPACER_COUNT).fill(null),
    ...arr,
    ...Array(SPACER_COUNT).fill(null),
  ];
};

const getSelected = (ref) => {
  const scrollTop = ref.current.scrollTop;
  return Math.round((scrollTop + COL_HEIGHT / 2) / ITEM_HEIGHT) - SPACER_COUNT;
};

const scrollToValue = (ref, val) => {
  ref.current.scrollTop =
    (val + SPACER_COUNT) * ITEM_HEIGHT + ITEM_HEIGHT / 2 - COL_HEIGHT / 2;
};

const updateHighlight = (ref, val) => {
  ref.current.querySelectorAll(".picker-item[data-val]").forEach((el) => {
    el.classList.toggle("active", parseInt(el.dataset.val) === val);
  });
};


const AlarmPicker = ({ alarmTime, setAlarmTime }) => {
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);


const handleHourScroll = useCallback(() => {
       if (!hoursRef.current) return;
       const hour = Math.max(0, Math.min(23, getSelected(hoursRef)));
       updateHighlight(hoursRef, hour);
       setAlarmTime((prev) => {
          const prevMinute = prev ? prev.split(":")[1] : "00";
          const next = String(hour).padStart(2, "0") + ":" + prevMinute;
          return next !== prev ? next : prev;
    });
}, [setAlarmTime]);

 const handleMinuteScroll = useCallback(() => {
    if (!minutesRef.current) return;
    const minute = Math.max(0, Math.min(59, getSelected(minutesRef)));
    updateHighlight(minutesRef, minute); 
    setAlarmTime((prev) => {
      const prevHour = prev ? prev.split(":")[0] : "00";
      const next = prevHour + ":" + String(minute).padStart(2, "0");
      return next !== prev ? next : prev;
    });
  }, [setAlarmTime]);


  useEffect(() => {
    const now = new Date();
    const h = alarmTime ? Number(alarmTime.split(":")[0]) : now.getHours();
    const m = alarmTime ? Number(alarmTime.split(":")[1]) : now.getMinutes();

    if (!alarmTime) {
      const formatted = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
      setAlarmTime(formatted);
    }

    if (hoursRef.current) {
       scrollToValue(hoursRef, h);
       updateHighlight(hoursRef, h);
    };
    if (minutesRef.current) {
       scrollToValue(minutesRef, m);
      updateHighlight(minutesRef, m);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="picker-container">
      <div className="picker-column" ref={hoursRef} onScroll={handleHourScroll}>
        {addSpacers(generateNumbers(24)).map((h, idx) => (
          <div
            key={idx}
            className={`picker-item ${h === null ? "spacer" : ""}`}
             data-val={h !== null ? h : undefined} 
          >
            {h !== null ? String(h).padStart(2, "0") : ""}
          </div>
        ))}
      </div>

      <div className="picker-separator">:</div>

      <div className="picker-column" ref={minutesRef} onScroll={handleMinuteScroll}>
        {addSpacers(generateNumbers(60)).map((m, idx) => (
          <div
            key={idx}
            className={`picker-item ${m === null ? "spacer" : ""} `}
            data-val={m !== null ? m : undefined} 
          >
            {m !== null ? String(m).padStart(2, "0") : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlarmPicker;
