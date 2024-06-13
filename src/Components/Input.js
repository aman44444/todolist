import React, { useState } from 'react';
import '../Styles/Input.css';
import Output from './Output';
import AlarmClock from './Alarm';


const Input = () => {
    const [task, setTask] = useState("")
    const [data, setData] = useState([])
    const [alarm, setAlarm] = useState('');
    
    const onChangeHandler = (e) => setTask(e.target.value);

    const taskHandler = (e) => {
        e.preventDefault();
        setData([{ task, alarm},...data])
        setTask('');
        setAlarm('')
    }

    const deleteItem = (index) => {
        const finalData = data.filter((_, i) => i !== index )
        setData(finalData);
    }

    const setAlarmTimeHandler = (event) => {
        const inputAlarmTimeModified = event.target.value + ':00';
        setAlarm(inputAlarmTimeModified);
    };

    return (
        <>
         <div className="form-div">
        <form className="form">
          <div className="task-div">
            <input
              id="task-input"
              type="text"
              placeholder="Type Here..."
              value={task}
              onChange={onChangeHandler}
            />
            <input type="time" onChange={setAlarmTimeHandler} className="time" />
            <button id="task-button" onClick={taskHandler}>
              ADD
            </button>
          </div>
        </form>
      </div>
         <div className='container'>
          <div className='task-container'>
                
              {data.map((value, index) => (
            <div className="task-alarm-pair" key={index}>
              <Output id={index} task={value.task} onSelect={deleteItem} />
              <AlarmClock alarmTime={value.alarm} />
            </div>
          ))}
            </div>
         </div>
        </>
    );

}

export default Input;