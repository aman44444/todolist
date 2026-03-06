import { useEffect, useRef } from "react";
import useTodosStore from "../../store/store";

const Alarm = ({ isActive, onStop }) => {
  const { mode } = useTodosStore();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isActive) {
      audioRef.current.loop = true;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isActive]);

  const handleStop = () => {
    if (mode === "normal") {
      onStop();
    }
  };

  return (
    <div className="alarm-container">
      <audio ref={audioRef} src="/alarm.mp3" />

      {mode === "normal" && (
        <button className="stop-alarm-btn" onClick={handleStop}>
          Stop Alarm
        </button>
      )}

      {mode === "strict" && (
        <p className="strict-message">
          Complete the task to stop the alarm
        </p>
      )}
    </div>
  );
};

export default Alarm;