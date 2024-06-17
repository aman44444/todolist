import React, { useState } from 'react';
import '../Styles/Input.css';
import Output from './Output';
import Notification from './Notification';
import AlarmClock from './Reminder';

const Input = () => {
    const [task, setTask] = useState("")
    const [data, setData] = useState([])
    const [alarm, setAlarm] = useState('');
    const [notifications, setNotifications] = useState([]);

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

    const handleAlarmTrigger = (task) => {
        setNotifications([...notifications, task]);
    };

    const closeNotification = (task) => {
        setNotifications(notifications.filter(notif => notif !== task));
    };

    return (
        <>
         <div className="form-container">
            <form className="form">
               <div className="task-div">
                  <input
                      className="task-input"
                      type="text"
                      placeholder="Type Here..."
                      value={task}
                       onChange={onChangeHandler}
                  />
                   <input type="time" onChange={setAlarmTimeHandler} className="timer" />
                   <button className="add-button" onClick={taskHandler}>
                    ADD
                   </button>
               </div>
            </form>
         </div>
         <div className="notifications">
                {notifications.map((task, index) => (
                    <Notification key={index} task={task} onClose={() => closeNotification(task)} />
                ))}
            </div>
         <div className='container'>
          <div className='task-container'>
                
                {data.map((value, index) => (
                   <div className="task-alarm-pair" key={index}>
                        <Output 
                            id={index} 
                            number={index + 1} 
                            task={value.task} 
                            onSelect={deleteItem} />

                         <AlarmClock 
                            alarmTime={value.alarm} 
                            task={value.task}
                            onAlarmTrigger={handleAlarmTrigger}/>
           </div>
          ))}
            </div>
         </div>
        </>
    );

}

export default Input;

