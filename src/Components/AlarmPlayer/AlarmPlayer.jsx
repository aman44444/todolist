import { useEffect, useRef } from "react";
import useTodosStore from "../../store/store";
import alarmSound from "../../audio/alarm2.mp3";
import "../../styles/AlarmModal/AlarmModal.css";

const AlarmPlayer = () => {
  const { activeAlarmTaskId, mode, stopAlarm } = useTodosStore();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (activeAlarmTaskId) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});

      if (mode === "normal") {
        setTimeout(() => {
          handleStop();
        }, 5000);
      }
    }
  }, [activeAlarmTaskId, mode]);

  const handleStop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    stopAlarm();
  };

  return (
    <>
      <audio ref={audioRef} src={alarmSound} preload="auto" />

      {mode === "strict" && activeAlarmTaskId && (
        <div className="alarm-modal-overlay">
          <div className="alarm-modal">
            <h3>Alarm Ringing</h3>
            <p>You must stop it manually</p>

            <button onClick={handleStop} className="stop-btn">
              Stop Alarm
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AlarmPlayer;