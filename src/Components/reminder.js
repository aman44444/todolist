import React, { useState, useEffect, useCallback } from 'react';
import '../Styles/Alarm.css'
import alarmSound from '../audio/alarm2.mp3';

const playAlarmSound = () => {
  const audio = new Audio(alarmSound);
  audio.play();
};

const AlarmClock = ({alarmTime}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [alarmMessage, setAlarmMessage] = useState('');
 
  const checkAlarmClock = useCallback(() => {
    if (alarmTime) {
      setAlarmMessage(alarmTime);
      if (currentTime === alarmTime) {
        playAlarmSound();
      }
    }
  },[alarmTime,currentTime]);


  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    const interval = setInterval(checkAlarmClock, 1000);
       
    return () => {
      clearInterval(clock);
      clearInterval(interval);
    };
   
  }, [checkAlarmClock]);

  return (
    <div className="alarm-clock">
      {alarmMessage && <p> Reminder set for: {alarmMessage}</p>}
    </div>
  );
};

export default AlarmClock;

