import React, { useState, useEffect, useCallback } from 'react';
import '../Styles/Alarm.css'
import alarmSound from '../audio/alarm2.mp3';

const playAlarmSound = () => {
  const audio = new Audio(alarmSound);
  audio.play();
};

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmMessage, setAlarmMessage] = useState('');

  const checkAlarmClock = useCallback(() => {
    if (!alarmTime || alarmTime === 'undefined') {
      setAlarmMessage();
    } else {
      setAlarmMessage( alarmTime );
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

  const setAlarmTimeHandler = (event) => {
    event.preventDefault();
    const inputAlarmTimeModified = event.target.value + ':00';
    setAlarmTime(inputAlarmTimeModified);
    setAlarmMessage('');
  };

 

  const setAlarm = () => {
    if (!alarmTime || alarmTime === 'undefined') {
      setAlarmMessage('Please set a valid alarm time.');
    } else {
      setAlarmMessage(  alarmTime );
    }
  };

  return (
    <div>
      
      {/* <h2>It is {currentTime}.</h2>
      <h2>{alarmMessage}</h2> */}
      <form className="alarm-div">
        <input type="time" onChange={setAlarmTimeHandler} className='time'></input>
        {/* <button  className="set-btn" type="button" onClick={setAlarm}>
          Set Alarm
        </button> */}
      </form>
    </div>
  );
};

export default AlarmClock;
